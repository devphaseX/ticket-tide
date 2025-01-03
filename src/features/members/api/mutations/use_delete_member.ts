import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteWorkpaceMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.members[":memberId"].$delete(data);
      const payload = await resp.json();
      if (!resp.ok) {
        throw new ClientApiError(payload.message ?? "failed to delete member");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("member deleted succesfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["members"] }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[DELETE MEMBER ERROR]`, error);
      toast.error("failed to delete member");
    },
  });
};
