import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateWorkspaceFormData } from "../../schema";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, void, RequestType>({
    mutationKey: ["create_workspace"],
    mutationFn: async (data) => {
      const resp = await client.api.workspaces.$post(data);
      return resp.json();
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
