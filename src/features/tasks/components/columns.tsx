"use client";
import { Task, TaskWithProjectAssignee } from "@/lib/types";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { MemberAvatar } from "@/features/members/components/member_avatar";
import { TaskDate } from "./task_date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "./task_actions";

export const columns: ColumnDef<TaskWithProjectAssignee>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Task Name
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),

    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },

  {
    accessorKey: "project",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Project
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <p className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </p>
      );
    },
  },

  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assignee
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <p className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </p>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due Date
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={new Date(dueDate)} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { $id: id, projectId } = row.original;
      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
