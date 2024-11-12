import "server-only";
import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Storage as StorageType,
  type Users as UserType,
  type Databases as DatabasesType,
} from "node-appwrite";

import StatusCodes from "http-status";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/auth.constants";
import { env } from "./env";

type SesssionContext = {
  Variables: {
    account: AccountType;
    storage: StorageType;
    databases: DatabasesType;
    users: UserType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<SesssionContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(env.NEXT_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_APPWRITE_PROJECT_ID);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: "unauthorized" }, StatusCodes.UNAUTHORIZED);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set("user", user);
    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);

    await next();
  },
);
