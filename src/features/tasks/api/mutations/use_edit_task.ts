import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { DatabaseIcon } from "lucide-react";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.tasks[":taskId"].$patch(data);
      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to update task");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("task update successfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["task", data.data.task.$id],
        }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[UPDATE TASK ERROR]`, error);
      toast.error("failed to update task");
    },
  });
};
