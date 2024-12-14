import { MemberRole } from "@/features/members/member.types";
import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageUrl?: string | null;
  inviteCode?: string | null;
  userId: string;
};

export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
};

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  position: number;
  assigneeId: string;
};
