import { auth } from "@/features/api/server/get_current_user";
import { MembersList } from "@/features/workspaces/components/members_list";
import { redirect } from "next/navigation";

const CurrentWorkspaceMembersPage = async () => {
  const user = await auth();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default CurrentWorkspaceMembersPage;
