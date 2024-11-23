import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp =
        await client.api.workspaces[":workspaceId"]["join"].$post(data);

      if (!resp.ok) {
        if (resp.headers.get("content-type") === "application/json") {
          const payload = await resp.json();
          throw new ClientApiError(payload.message);
        }

        throw new ClientApiError("failed to join workspace");
      }

      return resp.json();
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("joined workspace");
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[JOIN WORKSPACE ERROR]`, error);
      toast.error("failed to join workspace via invalid code");
    },
  });
};
