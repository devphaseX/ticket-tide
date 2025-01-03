import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateWorkspaceFormData } from "../../schema";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.workspaces[":workspaceId"].$patch(data);
      const payload = await resp.json();
      if (!payload.success) {
        throw new ClientApiError(
          payload.message ?? "failed to update workspace",
        );
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
        queryClient.invalidateQueries({
          queryKey: ["workspaces", data.data.$id],
        }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[UPDATE WORKSPACE ERROR]`, error);
      toast.error("failed to update workspace");
    },
  });
};
