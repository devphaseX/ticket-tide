import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetWorkspaceMembers = ({ workspaceId }: UseGetMembersProps) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const resp = await client.api.members.$get({ query: { workspaceId } });
      const payload = await resp.json();

      if (!payload.success) {
        throw new ClientApiError(
          payload.message ?? "failed to fetch workspace members",
        );
      }
      return payload.data;
    },
  });
};
