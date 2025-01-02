import { useParams } from "next/navigation";

export const useTaskIdParams = () => {
  const params = useParams();
  return params.taskId as string;
};
