import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseWorkspaceProjectsProps {
  workspaceId: string;
}

export const useWorkspaceProjects = ({
  workspaceId,
}: UseWorkspaceProjectsProps) => {
  return useQuery({
    queryKey: ["workspace_projects", workspaceId],
    queryFn: async () => {
      const resp = await client.api.projects.$get({ query: { workspaceId } });
      const payload = await resp.json();

      if (!payload.success) {
        throw new ClientApiError(
          payload.message ?? "failed to fetch workspace projects",
        );
      }
      return payload.data;
    },
  });
};
