import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { DatabaseIcon } from "lucide-react";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.projects.$post(data);

      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to create project");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("project created successfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["workspace_projects"] }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[CREATE PROJECT ERROR]`, error);
      toast.error("failed to create project");
    },
  });
};
