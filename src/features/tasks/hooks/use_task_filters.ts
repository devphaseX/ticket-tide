import { TaskStatus } from "@/lib/types";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum<TaskStatus>(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
