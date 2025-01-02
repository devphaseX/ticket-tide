import { Task, TaskStatus } from "@/lib/types";
import { TypeOf, z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().min(1).optional(),
});

export type CreateTaskFormData = TypeOf<typeof createTaskSchema>;

export const editTaskSchema = createTaskSchema.omit({
  workspaceId: true,
});

export type EditTaskFormData = TypeOf<typeof editTaskSchema>;

export const bulkUpdateTaskSchema = z.object({
  tasks: z.array(
    z.object({
      $id: z.string().min(1),
      status: z.nativeEnum(TaskStatus),
      position: z.coerce.number().int().positive().min(1000).max(1_000_000),
    }),
  ),
});

export type BulkUpdateTaskFormData = TypeOf<typeof bulkUpdateTaskSchema>;
