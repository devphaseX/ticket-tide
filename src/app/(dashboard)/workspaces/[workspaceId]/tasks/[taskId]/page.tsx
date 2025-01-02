import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <TaskIdClient />;
};
export default TaskIdPage;
