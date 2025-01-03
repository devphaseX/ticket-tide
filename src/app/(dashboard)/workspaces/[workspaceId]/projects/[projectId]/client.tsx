"use client";

import { PageError } from "@/components/page_error";
import { PageLoader } from "@/components/page_loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/query/use_workspace_project";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useProjectId } from "@/features/projects/hooks/use_project_id";
import { TaskViewSwitcher } from "@/features/tasks/components/task_view_switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data, error, isPending: isLoading } = useGetProject({ projectId });
  if (isLoading) {
    return <PageLoader />;
  }
  if (error) {
    return <PageError message="Project not found" />;
  }
  const project = data!.project;
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
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
