import { Button } from "@/components/ui/button";
import { auth } from "@/features/api/server/get_current_user";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { getProject } from "@/features/projects/queries";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  const project = await getProject({
    projectId: params.projectId,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>

        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrenWorkspaceProjectPage;
