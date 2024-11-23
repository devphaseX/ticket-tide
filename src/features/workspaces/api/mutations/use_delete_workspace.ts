import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateWorkspaceFormData } from "../../schema";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.workspaces[":workspaceId"].$delete(data);
      if (!resp.ok) {
        if (resp.headers.get("content-type") === "application/json") {
          const payload = await resp.json();
          throw new ClientApiError(payload.message);
        }

        throw new ClientApiError("failed to update workspace");
      }

      return resp.json();
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("workpace deleted succesfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
        queryClient.removeQueries({ queryKey: ["workspaces", data.data.$id] }),
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
