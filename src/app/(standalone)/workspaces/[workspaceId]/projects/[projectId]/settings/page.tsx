import { auth } from "@/features/api/server/get_current_user";
import { EditProjectForm } from "@/features/projects/components/edit_project_form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";
import { ProjectIdSettingsClient } from "./client";

interface CurrentPrijectSettingsPageProps {
  params: {
    projectId: string;
  };
}

const CurrentProjectSettingsPage = async ({
  params,
}: CurrentPrijectSettingsPageProps) => {
  const user = await auth();

  if (!user) {
    return redirect("/");
  }

  return <ProjectIdSettingsClient />;
};

export default CurrentProjectSettingsPage;
