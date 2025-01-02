import { auth } from "@/features/api/server/get_current_user";
import { TaskViewSwitcher } from "@/features/tasks/components/task_view_switcher";
import { getUserWorkspace } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

const TasksPage = async () => {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />;
    </div>
  );
};

export default TasksPage;
