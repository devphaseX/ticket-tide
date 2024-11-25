import { auth } from "@/features/api/server/get_current_user";
import { EditProjectForm } from "@/features/projects/components/edit_project_form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

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

  const project = await getProject({
    projectId: params.projectId,
  });

  if (!project) {
    throw new Error("project not found");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValue={project} />
    </div>
  );
};

export default CurrentProjectSettingsPage;
