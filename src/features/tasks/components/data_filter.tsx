import { useGetWorkspaceMembers } from "@/features/members/api/query/use_get_members";
import { useWorkspaceProjects } from "@/features/projects/api/query/use_workspace_projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { ProjectOption } from "../types";
import { DatePicker } from "@/components/date_picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "@/lib/types";
import { useTaskFilters } from "../hooks/use_task_filters";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useWorkspaceProjects(
    { workspaceId },
  );

  const { data: members, isLoading: isLoadingMembers } = useGetWorkspaceMembers(
    { workspaceId },
  );

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map<ProjectOption>((project) => ({
    $id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map<ProjectOption>((member) => ({
    $id: member.$id,
    name: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate, search }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value });
  };

  const onSearchChange = (value: string) => {
    setFilters({ search: value === "" ? null : value });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : value });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />

          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />

          {memberOptions?.map((member) => (
            <SelectItem key={member.$id} value={member.$id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />

          {projectOptions?.map((project) => (
            <SelectItem key={project.$id} value={project.$id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(selectedDate) => {
          setFilters({
            dueDate: selectedDate ? selectedDate.toISOString() : null,
          });
        }}
      />
    </div>
  );
};
