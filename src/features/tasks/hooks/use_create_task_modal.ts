"use client";
import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateTaskModal = () => {
  const [taskModalOpen, setTaskModalOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false),
  );

  const setOpen = () => setTaskModalOpen(true);
  const setClose = () => setTaskModalOpen(false);

  return {
    open: taskModalOpen,
    setTaskModalOpen,
    setOpen,
    setClose,
  };
};
