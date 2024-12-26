"use client";

import { ResponsiveModal } from "@/components/responsive_modal";
import { useCreateTaskModal } from "../hooks/use_create_task_modal";
import { useEditTaskModal } from "../hooks/use_edit_task_modal";
import { EditTaskFormWrapper } from "./edit_task_form_wrapper";

export const EditTaskModal = () => {
  const { taskId, setClose } = useEditTaskModal();
  console.log({ taskId });
  return (
    <ResponsiveModal open={typeof taskId === "string"} onOpenChange={setClose}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={setClose} />}
    </ResponsiveModal>
  );
};
