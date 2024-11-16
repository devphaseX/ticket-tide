import { TypeOf, z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required").max(256),
});

export type CreateWorkspaceFormData = TypeOf<typeof createWorkspaceSchema>;