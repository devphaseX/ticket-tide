import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { TrashIcon } from "@radix-ui/react-icons";
import { ExternalLink, PencilIcon } from "lucide-react";
import { useDeleteTask } from "../api/mutations/use_delete_task";
import { useConfirm } from "@/hooks/use_confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { useEditTaskModal } from "../hooks/use_edit_task_modal";
import { EditTaskModal } from "./edit_task_modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { taskId, setOpen } = useEditTaskModal();
  const { mutate: deleteTask, isPending: isTaskDeleting } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const onDelete = async () => {
    const allowDelete = await confirm();
    if (!allowDelete) return;
    deleteTask({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <>
      <ConfirmDialog />
      <div className="flex justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={onOpenTask}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLink className="size-4 mr-2 stroke-2" />
              Task Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenProject}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLink className="size-4 mr-2 stroke-2" />
              Open Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(id)}
              disabled={!!taskId}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-2 stroke-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isTaskDeleting}
              className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            >
              <TrashIcon className="size-4 mr-2 stroke-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
