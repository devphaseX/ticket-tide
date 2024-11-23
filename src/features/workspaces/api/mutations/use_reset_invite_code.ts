import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateWorkspaceFormData } from "../../schema";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp =
        await client.api.workspaces[":workspaceId"]["reset-invite-code"].$post(
          data,
        );

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

      toast.success("workspace invite code resetted");
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
      toast.error("failed to reset workspace invite code");
    },
  });
};
