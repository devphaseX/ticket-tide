import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageUrl?: string | null;
  inviteCode?: string | null;
  userId: string;
};
