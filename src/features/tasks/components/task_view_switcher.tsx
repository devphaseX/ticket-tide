"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use_create_task_modal";

export const TaskViewSwitcher = () => {
  const { setOpen } = useCreateTaskModal();
  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4 w-full">
        <div className="flex flex-col w-full gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto" defaultValue="table">
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
          <Button size="sm" className="w-full lg:w-auto" onClick={setOpen}>
            <Plus className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Data table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
