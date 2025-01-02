"use client";

import { CreateTaskModal } from "@/features/tasks/components/create_task_modal";
import { EditTaskModal } from "@/features/tasks/components/edit_task_modal";

export default function Default() {
  return (
    <>
      <CreateTaskModal />
      <EditTaskModal />
    </>
  );
}
