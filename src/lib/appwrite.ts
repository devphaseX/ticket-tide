import "server-only";

import { Client, Account, Databases } from "node-appwrite";
import { env } from "./env";

export const createAdminClient = () => {
  const client = new Client()
    .setProject(env.NEXT_APPWRITE_PROJECT_ID)
    .setEndpoint(env.NEXT_APPWRITE_ENDPOINT)
    .setKey(env.NEXT_APPWRITE_API_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
};
