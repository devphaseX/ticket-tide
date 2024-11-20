import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";

const CurrentWorkspacePage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <div></div>;
};

export default CurrentWorkspacePage;
