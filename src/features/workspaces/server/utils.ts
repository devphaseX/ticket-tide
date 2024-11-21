import { env } from "@/lib/env";
import { Databases, Query } from "node-appwrite";

export const getMember = async ({
  workspaceId,
  userId,
  databases,
}: {
  workspaceId: string;
  userId: string;
  databases: Databases;
}) => {
  const members = await databases.listDocuments(
    env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
    [Query.equal("userId", userId), Query.equal("workspaceId", workspaceId)],
  );

  return members.documents[0];
};
