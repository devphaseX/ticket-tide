import { client } from "@/lib/rpc";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "../auth/auth.constants";
import { Account, Client, Databases, Query } from "node-appwrite";
import { env } from "@/lib/env";
import { getMember } from "./server/utils";

export const getUserWorkspace = async () => {
  const resp = await client.api.workspaces.$get(undefined, {
    headers: {
      authorization: `bearer ${(await cookies()).get(AUTH_COOKIE)?.value ?? ""}`,
    },
  });

  if (!resp.ok) {
    return null;
  }

  const data = await resp.json();
  return data;
};

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const client = new Client()
      .setEndpoint(env.NEXT_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_APPWRITE_PROJECT_ID);

    const session = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!session) return null;
    client.setSession(session);

    const db = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    if (!user) {
      return null;
    }

    const member = await getMember({
      databases: db,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const workspace = await db.getDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      workspaceId,
    );

    return workspace;
  } catch {
    return null;
  }
};
