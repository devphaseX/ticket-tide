import { auth } from "@/features/api/server/get_current_user";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join_workspace_form";
import { getWorkspace, getworkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface JoinWorkspacePageProps {
  params: { workspaceId: string; inviteCode: string };
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspaceInfo = await getworkspaceInfo({
    workspaceId: params.workspaceId,
  });
  if (!workspaceInfo) {
    return redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValue={{
          name: workspaceInfo.name,
        }}
        code={params.inviteCode}
        workspaceId={params.workspaceId}
      />
    </div>
  );
};

export default JoinWorkspacePage;
