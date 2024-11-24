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
