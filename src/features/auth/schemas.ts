import { z } from "zod";

export const signinRequestSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, { message: "password cannot be empty" }),
});
