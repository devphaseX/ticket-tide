"use client";
import { TaskStatus } from "@/lib/types";
import { useQueryState, parseAsBoolean, parseAsStringEnum } from "nuqs";

export const useCreateTaskModal = () => {
  const [taskModalOpen, setTaskModalOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false),
  );

  const [initialStatus, setInitialStatus] = useQueryState(
    "status",
    parseAsStringEnum(Object.values(TaskStatus)),
  );

  const setOpen = (initialStatus?: TaskStatus) => {
    setTaskModalOpen(true);
    if (initialStatus) {
      setInitialStatus(initialStatus);
    }
  };
  const setClose = () => {
    setTaskModalOpen(false);
    setInitialStatus(null);
  };

  return {
    open: taskModalOpen,
    initialStatus,
    setTaskModalOpen,
    setOpen,
    setClose,
  };
};
