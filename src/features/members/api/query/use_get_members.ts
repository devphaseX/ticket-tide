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
      if (!resp.ok) {
        if (resp.headers.get("content-type") === "application/json") {
          const payload = await resp.json();
          throw new ClientApiError(payload.message);
        }

        throw new ClientApiError("failed to get members");
      }

      return resp.json();
    },
  });
};
