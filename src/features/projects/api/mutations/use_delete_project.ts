import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { ClientApiError } from "@/lib/errors";
import { toast } from "sonner";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const resp = await client.api.projects[":projectId"].$delete(data);

      const payload = await resp.json();

      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to delete project");
      }

      return payload;
    },

    onSuccess: async (data) => {
      if (!data.success) {
        return;
      }

      toast.success("project deleted succesfully");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["workspace_projects", data.data.workspaceId],
        }),
        queryClient.removeQueries({
          queryKey: ["projects", data.data.$id],
        }),
      ]);
    },

    onError: (error) => {
      if (error instanceof ClientApiError) {
        return toast.error(error.message);
      }

      console.log(`[DELETE PROJECT ERROR]`, error);
      toast.error("failed to delete workspace");
    },
  });
};
