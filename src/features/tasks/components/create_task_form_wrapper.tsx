import { Card, CardContent } from "@/components/ui/card";
import { useGetWorkspaceMembers } from "@/features/members/api/query/use_get_members";
import { useWorkspaceProjects } from "@/features/projects/api/query/use_workspace_projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { Loader } from "lucide-react";
import { MemberOption, ProjectOption } from "../types";
import { CreateTaskForm } from "./create_task_form";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useWorkspaceProjects(
    { workspaceId },
  );

  const { data: members, isLoading: isLoadingMembers } = useGetWorkspaceMembers(
    { workspaceId },
  );

  const projectOptions = projects?.documents.map<ProjectOption>((project) => ({
    $id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map<MemberOption>((member) => ({
    $id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <CreateTaskForm
        onCancel={onCancel}
        memberOptions={memberOptions ?? []}
        projectOptions={projectOptions ?? []}
      />
    </div>
  );
};
