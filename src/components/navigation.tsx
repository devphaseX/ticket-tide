"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";
import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { IconTree } from "react-icons/lib";
import { isAsync } from "zod";

type Route = {
  label: string;
  href: string | ((value: unknown) => string);
  icon: IconTree;
  activeIcon: IconTree;
};

const routes = [
  {
    label: "Home",
    href: (workspaceId: string) => `/workspaces/${workspaceId}`,
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: (workspaceId: string) => `/workspaces/${workspaceId}/tasks`,
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },

  {
    label: "Settings",
    href: (workspaceId: string) => `/workspaces/${workspaceId}/settings`,
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },

  {
    label: "Members",
    href: (workspaceId: string) => `/workspaces/${workspaceId}/members`,
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const href =
          typeof item.href === "function" ? item.href(workspaceId) : item.href;
        const isActive = pathname === href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={href} href={href}>
            <div
              className={cn(
                `flex items-center gap-2.5 p-2.5 rounded-md
                font-medium hover:text-primary transition text-neutral-500`,
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
