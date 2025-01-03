"use client";

import { PageError } from "@/components/page_error";
import { PageLoader } from "@/components/page_loader";
import { useGetWorkspace } from "@/features/workspaces/api/query/use_get_workspaces copy";
import { EditWorkspaceForm } from "@/features/workspaces/components/update_workspace_form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";

export const WorkspaceSettingsClient = () => {
  const workspaceId = useWorkspaceId();

  const { data, error, isPending } = useGetWorkspace({ workspaceId });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message="Workspace not found" />;
  }

  const workspace = data.workspace;

  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValue={workspace} />
    </div>
  );
};
