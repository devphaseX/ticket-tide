"use client";

import { PageError } from "@/components/page_error";
import { PageLoader } from "@/components/page_loader";
import { useGetProject } from "@/features/projects/api/query/use_workspace_project";
import { EditProjectForm } from "@/features/projects/components/edit_project_form";
import { useProjectId } from "@/features/projects/hooks/use_project_id";

export const ProjectIdSettingsClient = () => {
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
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValue={project} />
    </div>
  );
};
