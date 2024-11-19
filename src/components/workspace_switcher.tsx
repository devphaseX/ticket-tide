"use client";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/query/use_get_workspaces";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace_avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaces();

  const router = useRouter();

  const onSelectSwitchWorkspace = (id: string) => {
    router.push(`/workspaces/${id}`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer
        hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelectSwitchWorkspace} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent>
          {data?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
