"use client";
import { ResponsiveModal } from "@/components/responsive_modal";
import { CreateWorkspaceForm } from "./create_workspace_form";
import { usePathname, useRouter } from "next/navigation";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const path = usePathname();
  return (
    <ResponsiveModal
      open={path === "/workspaces/create"}
      onOpenChange={() => {
        router.back();
      }}
    >
      <CreateWorkspaceForm
        onCancel={() => {
          router.back();
        }}
      />
    </ResponsiveModal>
  );
};
