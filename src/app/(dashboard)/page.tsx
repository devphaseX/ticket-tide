import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";
import { getUserWorkspace } from "@/features/workspaces/queries";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  const workspaces = await getUserWorkspace();
  if (!workspaces?.total) {
    return redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces.documents[0].$id}`);
  return null;
}
