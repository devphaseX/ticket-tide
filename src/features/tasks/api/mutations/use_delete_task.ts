import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { DatabaseIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.tasks[":taskId"].$delete(data);

      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to delete task");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("task deleted successfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [
            "project_tasks",
            data.data.workspaceId,
            data.data.projectId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["project_tasks", data.data.workspaceId],
        }),
        queryClient.removeQueries({
          queryKey: ["tasks", data.data.$id],
        }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[DELTE TASK ERROR]`, error);
      toast.error("failed to delete task");
    },
  });
};
