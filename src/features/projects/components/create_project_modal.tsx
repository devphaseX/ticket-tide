"use client";
import { ResponsiveModal } from "@/components/responsive_modal";
import { usePathname, useRouter } from "next/navigation";
import { CreateProjectForm } from "./create_project_form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";

export const CreateProjectModal = () => {
  const router = useRouter();
  const path = usePathname();

  const workspaceId = useWorkspaceId();

  return (
    <ResponsiveModal
      open={Boolean(
        workspaceId && path === `/workspaces/${workspaceId}/projects/create`,
      )}
      onOpenChange={() => {
        router.back();
      }}
    >
      <CreateProjectForm
        onCancel={() => {
          router.back();
        }}
      />
    </ResponsiveModal>
  );
};
