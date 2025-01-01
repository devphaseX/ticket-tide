import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { DatabaseIcon } from "lucide-react";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBulkTasksUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.tasks["bulk-update"].$post(data);

      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(
          payload.message ?? "failed to perform bulk task update",
        );
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("tasks updated successfully");
      const { tasks } = data.data;
      const [{ workspaceId }] = tasks;

      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["project_tasks", workspaceId],
        }),
        ...tasks.flatMap((task) => [
          queryClient.invalidateQueries({
            queryKey: ["project_tasks", workspaceId, task.projectId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["task", task.$id],
          }),
        ]),
      ]);
    },
    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[BULK TASK UPDATE ERROR]`, error);
      toast.error("failed to perform bulk task update");
    },
  });
};
