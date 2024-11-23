"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/mutations/use_join_workspace";
import { useWorkspaceId } from "../hooks/use_workspace_id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValue: {
    name: string;
  };

  code: string;
  workspaceId: string;
}

export const JoinWorkspaceForm = ({
  initialValue,
  workspaceId,
  code,
}: JoinWorkspaceFormProps) => {
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();
  const router = useRouter();
  const handleJoinWorkspace = () => {
    joinWorkspace(
      {
        json: { code },
        param: { workspaceId },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValue.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-y-2 gap-2 items-center justify-between">
          <Button
            size="lg"
            variant="secondary"
            type="button"
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            className="w-full lg:w-fit"
            type="button"
            onClick={handleJoinWorkspace}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
