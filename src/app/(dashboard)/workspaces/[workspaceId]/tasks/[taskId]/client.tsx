"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page_error";
import { PageLoader } from "@/components/page_loader";
import { useGetTask } from "@/features/tasks/api/queries/use_get_task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task_breadcrumbs";
import { TaskOverview } from "@/features/tasks/components/task_overview";
import { TaskDescription } from "@/features/tasks/components/text_description";
import { useTaskIdParams } from "@/features/tasks/hooks/use_task_id_params";

export const TaskIdClient = () => {
  const taskId = useTaskIdParams();
  const { data, error, isPending: isTaskLoading } = useGetTask({ taskId });

  if (isTaskLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message="task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.task.project} task={data.task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-col-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data.task} />
        <TaskDescription task={data.task} />
      </div>
    </div>
  );
};
