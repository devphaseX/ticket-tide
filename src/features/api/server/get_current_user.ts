import { AUTH_COOKIE } from "@/features/auth/auth.constants";
import { env } from "@/lib/env";
import { client } from "@/lib/rpc";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { cache } from "react";
import "server-only";

export const auth = cache(async () => {
  try {
    const client = new Client()
      .setEndpoint(env.NEXT_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_APPWRITE_PROJECT_ID);

    const cookie = await cookies();
    const session = cookie.get(AUTH_COOKIE)?.value;
    console.log({ session });
    if (!session) {
      return null;
    }
    client.setSession(session);
    const account = new Account(client);
    const user = await account.get();
    console.log({ user });

    return user;
  } catch (e) {
    console.log("server get user error ", e);
    return null;
  }
});
