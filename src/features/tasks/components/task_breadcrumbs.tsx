import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { Project, Task } from "@/lib/types";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useDeleteTask } from "../api/mutations/use_delete_task";
import { useConfirm } from "@/hooks/use_confirm";
import { ca } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const router = useRouter();

  const [ConfirmTaskDialog, confirm] = useConfirm({
    title: "Delete task",
    message: "Are you sure you want to delete this task?",
    variant: "destructive",
  });

  const handleDeleteTask = async () => {
    const shouldDelete = await confirm();
    if (!shouldDelete) {
      return;
    }
    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/projects/${project.$id}`);
        },
      },
    );
  };

  return (
    <>
      <ConfirmTaskDialog />
      <div className="flex items-center gap-x-2">
        <ProjectAvatar
          name={project.name}
          image={project.imageUrl}
          className="size-6 lg:size-8"
        />

        <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
          <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
            {project.name}
          </p>
        </Link>
        <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
        <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
        <Button
          className="ml-auto"
          variant="destructive"
          disabled={isPending}
          size="sm"
          onClick={handleDeleteTask}
        >
          <TrashIcon className="size-4 lg:mr-2" />
          <span className="hidden lg:block">Delete task</span>
        </Button>
      </div>
    </>
  );
};
