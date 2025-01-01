"use client";
import { TaskStatus } from "@/lib/types";
import { useQueryState, parseAsBoolean, parseAsStringEnum } from "nuqs";
import { useState } from "react";
import { useSelectCreateTask } from "./use_select_create_task";

export const useCreateTaskModal = () => {
  const [taskModalOpen, setTaskModalOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false),
  );

  const { selected, setSelected } = useSelectCreateTask();
  const setOpen = (initialStatus?: TaskStatus) => {
    setSelected(initialStatus ?? null);
    setTaskModalOpen(true);
  };

  const setClose = () => {
    setTaskModalOpen(false);
    setSelected(null);
  };

  return {
    open: taskModalOpen,
    initialStatus: selected,
    setTaskModalOpen,
    setOpen,
    setClose,
  };
};
