import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  workspaceId: string;
  projectId: string;
}

export const useGetTasks = ({ workspaceId, projectId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["project_tasks", projectId],
    queryFn: async () => {
      const resp = await client.api.tasks.$get({
        query: { workspaceId, projectId },
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
