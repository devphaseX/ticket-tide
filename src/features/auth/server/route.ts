import { ID, AppwriteException } from "node-appwrite";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { registerReqPayloadSchema, signinRequestSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../auth.constants";
import { sessionMiddleware } from "@/lib/session_middleware";
import { errorResponse, successResponse } from "@/lib/api_response";
import StatusCodes from "http-status";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ success: true, data: user });
  })
  .post("/sign-in", zValidator("json", signinRequestSchema), async (c) => {
    const reqPayload = c.req.valid("json");

    const { account } = createAdminClient();
    try {
      const session = await account.createEmailPasswordSession(
        reqPayload.email,
        reqPayload.password,
      );

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(session.expire),
      });

      return successResponse(c);
    } catch (e) {
      if (Object(e) === e && e instanceof AppwriteException) {
        return errorResponse(c, e.message);
      }

      return errorResponse(c, "failed to sign in user");
    }
  })
  .post("/sign-up", zValidator("json", registerReqPayloadSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const { account } = createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
    });

    return successResponse(
      c,
      undefined,
      StatusCodes.CREATED,
      "registration completed",
    );
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return successResponse(c);
  });

export default app;
