"use client";

import { ResponsiveModal } from "@/components/responsive_modal";
import { useCreateTaskModal } from "../hooks/use_create_task_modal";
import { CreateTaskFormWrapper } from "./create_task_form_wrapper";

export const CreateTaskModal = () => {
  const { open, setTaskModalOpen, setClose } = useCreateTaskModal();

  return (
    <ResponsiveModal open={open} onOpenChange={setTaskModalOpen}>
      <CreateTaskFormWrapper onCancel={setClose} />
    </ResponsiveModal>
  );
};
