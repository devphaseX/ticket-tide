import { auth } from "@/features/api/server/get_current_user";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create_workspace_form";
import { redirect } from "next/navigation";

const CreateNewWorkspacePage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreateNewWorkspacePage;
