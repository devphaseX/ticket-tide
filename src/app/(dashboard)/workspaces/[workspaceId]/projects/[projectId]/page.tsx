import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";
import { ProjectIdClient } from "./client";

interface CurrenWorkspaceProjectPageProps {
  params: { projectId: string };
}
const CurrenWorkspaceProjectPage = async ({
  params,
}: CurrenWorkspaceProjectPageProps) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ProjectIdClient />;
};

export default CurrenWorkspaceProjectPage;
