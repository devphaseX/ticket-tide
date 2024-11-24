import { TypeOf, z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),

  workspaceId: z.string().min(1),
});

export type CreateProjectFormData = TypeOf<typeof createProjectSchema>;
