import { TypeOf, z } from "zod";

export const signinRequestSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, { message: "password cannot be empty" }),
});

export type SigninRequestPayload = TypeOf<typeof signinRequestSchema>;

export const registerReqPayloadSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8),
});

export type RegisterReqPayloadSchema = TypeOf<typeof registerReqPayloadSchema>;
