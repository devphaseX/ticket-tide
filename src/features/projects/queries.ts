import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../workspaces/server/utils";
import { env } from "@/lib/env";
import { Project } from "@/lib/types";
import { AppwriteException, Query } from "node-appwrite";

export const getProject = async ({ projectId }: { projectId: string }) => {
  try {
    const { account, databases: db } = await createSessionClient();
    const user = await account.get();

    if (!user) {
      return null;
    }

    const project = await db.getDocument<Project>(
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
      return null;
    }

    return project;
  } catch (e) {
    console.log((e as AppwriteException).message);
    return null;
  }
};
