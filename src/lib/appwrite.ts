import "server-only";

import { Client, Account, Databases, Users } from "node-appwrite";
import { env } from "./env";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/auth.constants";
import { Database } from "lucide-react";

export const createAdminClient = () => {
  const client = new Client()
    .setProject(env.NEXT_APPWRITE_PROJECT_ID)
    .setEndpoint(env.NEXT_APPWRITE_ENDPOINT)
    .setKey(env.NEXT_APPWRITE_API_KEY);

  return {
    get account() {
      return new Account(client);
    },

    get users() {
      return new Users(client);
    },
  };
};

export const createSessionClient = async () => {
  const client = new Client()
    .setProject(env.NEXT_APPWRITE_PROJECT_ID)
    .setEndpoint(env.NEXT_APPWRITE_ENDPOINT);

  const session = (await cookies()).get(AUTH_COOKIE);

  if (!(session && session.value.trim())) {
    throw new Error("unauthorized");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};
