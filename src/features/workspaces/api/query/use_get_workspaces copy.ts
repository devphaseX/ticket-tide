import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

type UseGetWorkspaceProps = {
  workspaceId: string;
};

export const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const resp = await client.api.workspaces[":workspaceId"].$get({
        param: { workspaceId },
      });

      if (!resp.ok) {
        throw new Error("cannot fetch workspace");
      }

      const payloadResp = await resp.json();
      if (!payloadResp.success) {
        throw new Error(payloadResp.message);
      }

      return payloadResp.data;
    },
  });
};
