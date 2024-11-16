import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session_middleware";
import { env } from "@/lib/env";
import { AppwriteException, ID } from "node-appwrite";
import { errorResponse, successResponse } from "@/lib/api_response";

import StatusCodes from "http-status";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const db = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");
    try {
      const workspace = await db.createDocument(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
        ID.unique(),
        { name, userId: user.$id },
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
