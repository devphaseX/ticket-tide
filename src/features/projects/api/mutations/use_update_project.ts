import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.projects[":projectId"].$patch(data);

      const payload = await resp.json();

      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to update project");
      }
      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("updated project");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["workspace_projects", data.data.workspaceId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", data.data.$id],
        }),
      ]);
    },

    onError: (error) => {
      console.log(`[UPDATE PROJECT ERROR]`, error);
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      toast.error("failed to update project");
    },
  });
};
