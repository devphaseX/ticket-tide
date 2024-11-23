import { getMember } from "@/features/workspaces/server/utils";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session_middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import StatusCodes from "http-status";
import { errorResponse, successResponse } from "@/lib/api_response";
import { env } from "@/lib/env";
import { AppwriteException, Query } from "node-appwrite";
import { Member, Workspace } from "@/lib/types";
import { MemberRole } from "../member.types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1),
      }),
    ),
    async (c) => {
      const { users } = createAdminClient();
      const db = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        c.status(StatusCodes.UNAUTHORIZED);
        return errorResponse(c, "Unauthorized");
      }

      const members = await db.listDocuments<Member>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)],
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        }),
      );

      return successResponse(c, {
        data: { ...members, documents: populatedMembers },
      });
    },
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const db = c.get("databases");

    const memberToDelete = await db.getDocument<Member>(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      memberId,
    );

    const currentMember = await getMember({
      databases: db,
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
    });

    const memberTotal = await db.listDocuments(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      [Query.equal("workspaceId", currentMember.workspaceId)],
    );

    if (
      currentMember.$id !== memberToDelete.$id &&
      currentMember.role === MemberRole.MEMBER
    ) {
      c.status(StatusCodes.FORBIDDEN);
      return errorResponse(
        c,
        "You must be an admin to remove users from this workspace",
      );
    }

    if (memberTotal.total === 1) {
      c.status(StatusCodes.FORBIDDEN);
      return errorResponse(c, "cannot delete the only member");
    }

    await db.deleteDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      memberId,
    );

    return successResponse(
      c,
      { data: { $id: memberToDelete.$id } },
      StatusCodes.OK,
      "member removed successfully",
    );
  })
  .patch(
    "/:memberId/change-role",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const db = c.get("databases");
      const { role } = c.req.valid("json");

      const memberToUpdate = await db.getDocument<Member>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
        memberId,
      );

      const currentMember = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      const memberTotal = await db.listDocuments(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      );

      if (
        currentMember.$id !== memberToUpdate.$id &&
        currentMember.role === MemberRole.MEMBER
      ) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(
          c,
          "You must be an admin to update users role for this workspace",
        );
      }

      if (memberTotal.total === 1 && role === MemberRole.MEMBER) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "cannot downgrade the only member role");
      }

      await db.updateDocument<Member>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
        memberId,
        {
          role,
        },
      );

      return successResponse(
        c,
        { data: { $id: memberToUpdate.$id } },
        StatusCodes.OK,
        "member role updated",
      );
    },
  );

export default app;
