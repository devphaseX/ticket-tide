import { Task, TaskStatus } from "@/lib/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { KanbanColumnHeader } from "./kanban_column_header";
interface DataKanbanProps {
  data: Task[];
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [Key in TaskStatus]: Task[];
};

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    for (const task of data) {
      const taskCategory = initialTasks[task.status] ?? [];
      taskCategory.push(task);
      initialTasks[task.status] = taskCategory;
    }

    for (const key of Object.keys(initialTasks) as Array<TaskStatus>) {
      initialTasks[key].sort((a, b) => a.position - b.position);
    }

    return initialTasks;
  });
  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
