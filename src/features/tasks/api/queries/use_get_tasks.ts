import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { TaskStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => {
  console.log([
    "project_tasks",
    workspaceId,
    projectId,
    status,
    search,
    assigneeId,
    dueDate,
  ]);
  return useQuery({
    queryKey: [
      "project_tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const resp = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          search: search ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(
          payload.message ?? "failed to fetch project tasks",
        );
      }
      return payload.data;
    },
  });
};
