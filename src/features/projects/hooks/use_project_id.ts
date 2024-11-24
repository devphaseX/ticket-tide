import { useParams } from "next/navigation";

export const useProjectId = () => {
  return useParams<{ projectId: string }>().projectId;
};
