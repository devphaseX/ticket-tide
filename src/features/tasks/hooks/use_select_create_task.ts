import { TaskStatus } from "@/lib/types";
import { create } from "zustand";

type UseSelectCreateTaskProps = {
  selected?: null | TaskStatus;
  setSelected: (selected: null | TaskStatus) => void;
};

export const useSelectCreateTask = create<UseSelectCreateTaskProps>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));
