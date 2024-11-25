"use client";

import { useWorkspaceProjects } from "@/features/projects/api/query/use_workspace_projects";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useProjectId } from "@/features/projects/hooks/use_project_id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { isAsync } from "zod";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useWorkspaceProjects({ workspaceId });
  const projectId = useProjectId();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer
      hover:opacity-75 transition"
          onClick={() => {
            router.push(`/workspaces/${workspaceId}/projects/create`);
          }}
        />
      </div>

      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = projectId === project.$id;
        return (
          <Link
            href={href}
            key={project.$id}
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
            )}
          >
            <ProjectAvatar image={project.imageUrl} name={project.name} />
            <span className="truncate">{project.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
