import { sessionMiddleware } from "@/lib/session_middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/workspaces/server/utils";
import { MemberRole } from "@/features/members/member.types";
import StatusCodes from "http-status";
import { errorResponse, successResponse } from "@/lib/api_response";
import { env } from "@/lib/env";
import { ID, Query, Users } from "node-appwrite";
import {
  Member,
  Project,
  Task,
  TaskStatus,
  TaskWithProjectAssignee,
} from "@/lib/types";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.coerce.date().nullish(),
      }),
    ),

    async (c) => {
      const { users } = createAdminClient();
      const db = c.get("databases");
      const user = c.get("user");

      const { workspaceId, assigneeId, dueDate, projectId, search, status } =
        c.req.valid("query");

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate.toISOString()));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      const tasks = await db.listDocuments<Task>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_TASKS_ID,
        query,
      );

      const projectIds = tasks.documents.map(({ projectId }) => projectId);
      const assigneeIds = tasks.documents.map(({ assigneeId }) => assigneeId);

      const projects = await db
        .listDocuments<Project>(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
          projectIds.length ? [Query.contains("$id", projectIds)] : [],
        )
        .then(
          (res) =>
            new Map<string, Project>(
              res.documents.map((item) => [item.$id, item]),
            ),
        );

      const members = await db
        .listDocuments<Member>(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
          assigneeIds.length ? [Query.equal("$id", assigneeIds)] : [],
        )
        .then((res) =>
          Promise.all(
            res.documents.map((item) =>
              users.get(item.userId).then((user) => ({
                ...member,
                name: user.name,
                email: user.email,
              })),
            ),
          ),
        )
        .then(
          (res) =>
            new Map<string, (typeof res)[0]>(
              res.map((item) => [item.$id, item]),
            ),
        );

      const populatedTask = tasks.documents.map<TaskWithProjectAssignee>(
        (task) => {
          const project = projects.get(task.projectId)!;
          const assignee = members.get(task.assigneeId)!;

          return {
            ...task,
            project,
            assignee,
          };
        },
      );

      return successResponse(c, {
        data: { ...tasks, documents: populatedTask },
      });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const db = c.get("databases");
      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        c.req.valid("json");

      const member = await getMember({
        databases: db,
        userId: user.$id,
        workspaceId,
      });

      if (!(member && member.role === MemberRole.ADMIN)) {
        c.status(StatusCodes.FORBIDDEN);
        return errorResponse(c, "unauthorized");
      }

      const highestPositionTask = await db.listDocuments<Task>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await db.createDocument<Task>(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      );

      c.status(StatusCodes.CREATED);
      return successResponse(c, { data: task });
    },
  );
export default app;
