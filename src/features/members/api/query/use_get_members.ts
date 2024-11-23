import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetWorkspaceMembers = ({ workspaceId }: UseGetMembersProps) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const resp = await client.api.members.$get({ query: { workspaceId } });
      if (!resp.ok) {
        throw new Error("cannot fetch workspace members");
      }

      return resp.json();
    },
  });
};
