import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user_button";
import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create_workspace_form";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm />
    </div>
  );
}
