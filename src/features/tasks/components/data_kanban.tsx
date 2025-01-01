import {
  Task,
  TaskStatus,
  TaskWithProjectAssignee,
  UpdateTaskLocationPayload,
} from "@/lib/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KanbanColumnHeader } from "./kanban_column_header";
import { KanbanCard } from "./kanban_card";
import { useBulkTasksUpdate } from "../api/mutations/use_bulk_task_update";
interface DataKanbanProps {
  data: TaskWithProjectAssignee[];
  onChange: (payload: UpdateTaskLocationPayload[]) => void;
  disabled?: boolean;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [Key in TaskStatus]: TaskWithProjectAssignee[];
};

export const DataKanban = ({
  data: initialData,
  onChange,
  disabled,
}: DataKanbanProps) => {
  const data = useMemo(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    for (const task of initialData) {
      const taskCategory = newTasks[task.status] ?? [];
      taskCategory.push(task);
      newTasks[task.status] = taskCategory;
    }

    for (const key of Object.keys(newTasks) as Array<TaskStatus>) {
      newTasks[key].sort((a, b) => a.position - b.position);
    }

    return newTasks;
  }, [initialData]);
  const [tasks, setTasks] = useState<TasksState>(data);

  useEffect(() => {
    if (tasks !== data) {
      setTasks(data);
    }
  }, [data]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || disabled) return;

    const { source, destination } = result;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatesPayload: UpdateTaskLocationPayload[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      //Safely remove the task from the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.error("No task found at the source index");
        return prevTasks;
      }

      //create a task object with potentially updated status
      const updatedMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;

      //Update the source column
      newTasks[sourceStatus] = sourceColumn;

      //Add the task to the destination columns

      const destColumn = [...newTasks[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destStatus] = destColumn;

      //prepare minimal update payload
      updatesPayload = [];

      //Alway updated the moved task
      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: destStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      //Update position for affected tasks in the destination column

      newTasks[destStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: destStatus,
              position: newPosition,
            });
          }
        }
      });

      if (sourceStatus !== destStatus) {
        //If the task moved betweens columns, Update positions in the source column
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });

    onChange(updatesPayload);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
