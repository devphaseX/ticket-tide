import { ClientApiError } from "@/lib/errors";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseWorkspaceProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: UseWorkspaceProjectProps) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const resp = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });
      const payload = await resp.json();

      if (!payload.success) {
        throw new ClientApiError(payload.message ?? "failed to fetch project");
      }
      return payload.data;
    },
  });
};
