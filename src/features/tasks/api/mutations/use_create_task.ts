import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { DatabaseIcon } from "lucide-react";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.tasks.$post(data);

      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to create task");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("task created successfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["project_tasks", data.data.projectId],
        }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[CREATE TASK ERROR]`, error);
      toast.error("failed to create task");
    },
  });
};
