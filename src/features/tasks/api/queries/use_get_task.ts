import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { TaskStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const resp = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });
      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to fetch task");
      }
      return payload.data;
    },
  });
};
