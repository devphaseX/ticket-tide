import { auth } from "@/features/api/server/get_current_user";
import { WorkspaceSettingsClient } from "./client";
import { redirect } from "next/navigation";

const CurrentWorkspaceSettingsPage = async () => {
  const user = await auth();
  if (!user) {
    return redirect("/sign-in");
  }

  return <WorkspaceSettingsClient />;
};

export default CurrentWorkspaceSettingsPage;
