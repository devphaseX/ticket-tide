"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Plus } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use_create_task_modal";
import { useGetTasks } from "../api/queries/use_get_tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { useProjectId } from "@/features/projects/hooks/use_project_id";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { DataFilters } from "./data_filter";
import { useTaskFilters } from "../hooks/use_task_filters";
import { DataTable } from "./data_table";
import { columns } from "./columns";
import {
  Task,
  TaskWithProjectAssignee,
  UpdateTaskLocationPayload,
} from "@/lib/types";
import { DataKanban } from "./data_kanban";
import { useCallback } from "react";
import { useBulkTasksUpdate } from "../api/mutations/use_bulk_task_update";

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState(
    "task-view",
    parseAsStringEnum(["table", "kanban", "calendar"]).withDefault("table"),
  );

  const { setOpen } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const [{ status, assigneeId, projectId, dueDate, search }] = useTaskFilters();

  const { data, isPending: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
    search,
  });

  const { mutate: bulkTasksUpdate, isPending: isBulkTasksUpdating } =
    useBulkTasksUpdate();

  const onKanbanChange = useCallback((tasks: UpdateTaskLocationPayload[]) => {
    bulkTasksUpdate({ json: { tasks } });
  }, []);

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={(value) => setView(value as typeof view)}
    >
      <div className="h-full flex flex-col overflow-auto p-4 w-full">
        <div className="flex flex-col w-full gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full lg:w-auto"
            onClick={() => setOpen()}
          >
            <Plus className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border round-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable
                columns={columns}
                data={
                  (data?.documents as unknown as TaskWithProjectAssignee[]) ??
                  []
                }
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={data?.documents ?? []}
                disabled={isBulkTasksUpdating}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Data Calendar
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
