import { getMember } from "@/features/workspaces/server/utils";
import { sessionMiddleware } from "@/lib/session_middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import StatusCodes from "http-status";
import { errorResponse, successResponse } from "@/lib/api_response";
import { env } from "@/lib/env";
import { AppwriteException, ID, Query } from "node-appwrite";
import { Project } from "@/lib/types";
import { createProjectSchema, editProjectSchema } from "../project.schema";
import { MemberRole } from "@/features/members/member.types";
import { getProject } from "../queries";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1, { message: "missing workspaceId" }),
      }),
    ),

    async (c) => {
      const user = c.get("user");
      const db = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        workspaceId,
        userId: user.$id,
        databases: db,
      });

      if (!member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

      const projects = await db.listDocuments<Project>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
        [
          Query.equal("workspaceId", member.workspaceId),
          Query.orderDesc("$createdAt"),
        ],
      );

      return successResponse(c, { data: projects });
    },
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("databases");
    const { projectId } = c.req.param();

    const project = await getProject({ projectId });

    if (!project) {
      c.status(StatusCodes.NOT_FOUND);
      return errorResponse(c, "project not found");
    }

    const member = await getMember({
      workspaceId: project.workspaceId,
      userId: user.$id,
      databases: db,
    });

    if (!member) {
      c.status(StatusCodes.FORBIDDEN);
      return errorResponse(c, "unauthorized");
    }
    return successResponse(c, { data: { project } });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const db = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");
      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

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

        const project = await db.createDocument<Project>(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
          ID.unique(),
          { name, imageUrl: uploadedImageUrl, workspaceId },
        );

        return successResponse(c, { data: project }, StatusCodes.CREATED);
      } catch (e) {
        console.log(`[CREATE PROJECT ERROR]`, e);
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        if (e instanceof AppwriteException) {
          return errorResponse(c, e.message);
        }
        return errorResponse(c, "failed to create project");
      }
    },
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", editProjectSchema),
    async (c) => {
      const db = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");
      const { name, image } = c.req.valid("form");
      const { projectId } = c.req.param();

      const project = await db.getDocument(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
        projectId,
      );

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId: project.workspaceId,
      });

      if (!member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

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

        const updatedProject = await db.updateDocument<Project>(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
          projectId,
          {
            name: name ?? project.name,
            imageUrl: uploadedImageUrl,
          },
        );

        return successResponse(c, { data: updatedProject });
      } catch (e) {
        console.log(`[UPDATE PROJECT ERROR]`, e);
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        if (e instanceof AppwriteException) {
          return errorResponse(c, e.message);
        }
        return errorResponse(c, "failed to update project");
      }
    },
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    try {
      const db = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { projectId } = c.req.param();

      const project = await getProject({
        projectId,
      });

      if (!project) {
        c.status(StatusCodes.NOT_FOUND);
        return errorResponse(c, "project not found");
      }

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId: project.workspaceId,
      });

      if (!member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

      //TODO: Delete member
      await db.deleteDocument(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
        project.$id,
      );

      return successResponse(c, {
        data: { $id: projectId, workspaceId: project.workspaceId },
      });
    } catch (e) {
      c.status(StatusCodes.INTERNAL_SERVER_ERROR);
      return errorResponse(c, "failed to delete project");
    }
  });

export default app;
