import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, editWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session_middleware";
import { env } from "@/lib/env";
import { AppwriteException, ID, Query } from "node-appwrite";
import { errorResponse, successResponse } from "@/lib/api_response";

import StatusCodes from "http-status";
import { MemberRole } from "@/features/members/member.types";
import { generateInviteCode } from "@/lib/generate_invite_code";
import { getMember } from "./utils";
import { z } from "zod";
import { Member, Workspace } from "@/lib/types";
import { getWorkspace } from "../queries";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("databases");

    const workspaceMemberships = await db.listDocuments(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      [Query.equal("userId", user.$id)],
    );

    if (!workspaceMemberships.total) {
      return successResponse(c, { documents: [], total: 0 });
    }

    const workspaces = await db.listDocuments(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains(
          "$id",
          workspaceMemberships.documents.map((memeber) => memeber.workspaceId),
        ),
      ],
    );

    return successResponse(c, workspaces);
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await getWorkspace({ workspaceId });

    if (!workspace) {
      c.status(StatusCodes.NOT_FOUND);
      return errorResponse(c, "workspace not found");
    }

    return successResponse(c, { data: { workspace } });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const db = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");
      try {
        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
            ID.unique(),
            image,
          );

          const imageContent = await storage.getFilePreview(
            env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
            file.$id,
          );

          uploadedImageUrl = `data:${image.type ?? "image/png"};base64,${Buffer.from(imageContent).toString("base64")}`;
        }

        const inviteCode = generateInviteCode(10);
        const workspace = await db.createDocument(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
          ID.unique(),
          { name, userId: user.$id, imageUrl: uploadedImageUrl, inviteCode },
        );

        await db.createDocument(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
          ID.unique(),
          {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN,
          },
        );

        return successResponse(c, { data: workspace }, StatusCodes.CREATED);
      } catch (e) {
        console.log(`[CREATE WORKSPACE ERROR]`, e);
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        if (e instanceof AppwriteException) {
          return errorResponse(c, e.message);
        }
        return errorResponse(c, "failed to create workspace");
      }
    },
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", editWorkspaceSchema),
    async (c) => {
      const db = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      try {
        const member = await getMember({
          databases: db,
          userId: user.$id,
          workspaceId,
        });

        if (!(member && member.role === MemberRole.ADMIN)) {
          c.status(StatusCodes.NOT_FOUND);
          return errorResponse(c, "not found");
        }

        const workspace = await db.getDocument(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
          workspaceId,
        );

        if (!workspace) {
          return errorResponse(c, `failed to update workspace`);
        }

        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
            ID.unique(),
            image,
          );

          const imageContent = await storage.getFilePreview(
            env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
            file.$id,
          );

          uploadedImageUrl = `data:${image.type ?? "image/png"};base64,${Buffer.from(imageContent).toString("base64")}`;
        }

        const update = {
          name: name ?? workspace.name,
          imageUrl: uploadedImageUrl ?? workspace.imageUrl,
        };

        const updatedWorkspace = await db.updateDocument(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
          workspaceId,
          update,
        );

        return successResponse(
          c,
          { data: updatedWorkspace },
          StatusCodes.OK,
          "workspace updated",
        );
      } catch (e) {
        console.log(`[UPDATE WORKSPACE ERROR]`, e);
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        if (e instanceof AppwriteException) {
          return errorResponse(c, e.message);
        }
        return errorResponse(c, "failed to update workspace");
      }
    },
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const db = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases: db,
      userId: user.$id,
      workspaceId,
    });

    if (!(member && member.role === MemberRole.ADMIN)) {
      c.status(StatusCodes.UNAUTHORIZED);
      return errorResponse(c, "unauthorized");
    }

    //TODO: Delete member
    const removeDoc = await db.deleteDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      workspaceId,
    );

    if (!removeDoc) {
      c.status(StatusCodes.NOT_FOUND);
      return errorResponse(c, "workspace not found");
    }

    return successResponse(c, { data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const db = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases: db,
      userId: user.$id,
      workspaceId,
    });

    if (!(member && member.role === MemberRole.ADMIN)) {
      c.status(StatusCodes.UNAUTHORIZED);
      return errorResponse(c, "unauthorized");
    }

    const inviteCode = generateInviteCode(10);

    const updatedWorkspace = await db.updateDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      workspaceId,
      {
        inviteCode,
      },
    );

    if (!updatedWorkspace) {
      c.status(StatusCodes.NOT_FOUND);
      return errorResponse(c, "workspace not found");
    }

    return successResponse(c, { data: { $id: workspaceId } });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string().min(1) })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const user = c.get("user");
      const db = c.get("databases");

      const member = await getMember({
        workspaceId,
        databases: db,
        userId: user.$id,
      });

      if (member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "user already a member of this workspace");
      }

      const workspace = await db.getDocument<Workspace>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
        workspaceId,
      );

      if (workspace.inviteCode !== code) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "Invalid invite code provided.");
      }

      await db.createDocument<Member>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: MemberRole.MEMBER,
        },
      );

      c.status(StatusCodes.CREATED);
      return successResponse(c, { data: workspace });
    },
  );
export default app;
