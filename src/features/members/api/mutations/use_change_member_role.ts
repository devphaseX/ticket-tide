import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["change-role"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["change-role"]["$patch"]
>;

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp =
        await client.api.members[":memberId"]["change-role"].$patch(data);
      if (!resp.ok) {
        if (resp.headers.get("content-type") === "application/json") {
          const payload = await resp.json();
          throw new ClientApiError(payload.message);
        }

        throw new ClientApiError("failed to update member");
      }

      return resp.json();
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("member  role updated");
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["members"] }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[UPDATE MEMBER ROLE ERROR]`, error);
      toast.error("failed to update member role");
    },
  });
};
