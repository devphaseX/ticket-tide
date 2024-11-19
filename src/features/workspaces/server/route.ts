import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session_middleware";
import { env } from "@/lib/env";
import { AppwriteException, ID, Query } from "node-appwrite";
import { errorResponse, successResponse } from "@/lib/api_response";

import StatusCodes from "http-status";
import { MemberRole } from "@/features/members/member.types";
import { generateInviteCode } from "@/lib/generate_invite_code";

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

    console.log({ workspaces });

    return successResponse(c, workspaces);
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
      console.log({ name, image });
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
        if (e instanceof AppwriteException) {
          return errorResponse(c, e.message);
        }
        return errorResponse(c, "failed to create workspace");
      }
    },
  );
export default app;
