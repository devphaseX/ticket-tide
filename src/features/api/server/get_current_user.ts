import { AUTH_COOKIE } from "@/features/auth/auth.constants";
import { client } from "@/lib/rpc";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export const auth = cache(async () => {
  try {
    const cookie = await Promise.resolve(cookies());
    const resp = await client.api.auth.current.$get(undefined, {
      headers: {
        Authorization: `bearer ${cookie.get(AUTH_COOKIE)?.value ?? ""}`,
      },
    });
    const respPayload = await resp.json();

    if (!respPayload.success) {
      return null;
    }
    return respPayload.data;
  } catch (e) {
    console.log("server get user error ", e);
    return null;
  }
});
