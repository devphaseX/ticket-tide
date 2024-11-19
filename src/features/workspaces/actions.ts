import { client } from "@/lib/rpc";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "../auth/auth.constants";

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
