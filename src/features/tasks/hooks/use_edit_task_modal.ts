"use client";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);
  const setOpen = (id: string) => setTaskId(id);
  const setClose = () => setTaskId(null);
  return {
    taskId,
    setOpen,
    setClose,
  };
};
