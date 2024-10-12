import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signinRequestSchema } from "../schemas";

const app = new Hono().post(
  "/sign-in",
  zValidator("json", signinRequestSchema),
  async (c) => {
    const reqPayload = c.req.valid("json");
  },
);

export default app;
