import { auth } from "@/features/api/server/get_current_user";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/update_workspace_form";
import { Workspace } from "@/lib/types";
import { redirect } from "next/navigation";

interface CurrentWorkspaceSettingsPageProps {
  params: { workspaceId: string };
}

const CurrentWorkspaceSettingsPage = async ({
  params,
}: CurrentWorkspaceSettingsPageProps) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });
  if (!workspace) {
    return redirect("/");
  }

  return (
    <div>
      <EditWorkspaceForm initialValue={(workspace ?? {}) as Workspace} />
    </div>
  );
};

export default CurrentWorkspaceSettingsPage;
