"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use_workspace_id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetWorkspaceMembers } from "@/features/members/api/query/use_get_members";
import React from "react";
import { MemberAvatar } from "@/features/members/components/member_avatar";
import { MoreVerticalIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateMemberRole } from "@/features/members/api/mutations/use_change_member_role";
import { useDeleteWorkpaceMember } from "@/features/members/api/mutations/use_delete_member";
import { MemberRole } from "@/features/members/member.types";
import { useConfirm } from "@/hooks/use_confirm";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaceMembers({ workspaceId });

  const [ConfirmDialog, confirmRemoveMember] = useConfirm({
    title: "Remove member",
    message: "This member will be removed from the workspace",
    variant: "destructive",
  });
  const { mutate: updateMemberRole, isPending: isUpdatingMemberRole } =
    useUpdateMemberRole();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useDeleteWorkpaceMember();
  const isPending = isUpdatingMemberRole || isRemovingMember;

  const handleUpdateMemberRole = (memberId: string, role: MemberRole) => {
    updateMemberRole({ json: { role }, param: { memberId } });
  };

  const handleMemberRemove = async (memberId: string) => {
    const shouldRemoveMember = await confirmRemoveMember();
    if (!shouldRemoveMember) {
      return;
    }
    removeMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>

        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {data &&
          "data" in data &&
          data.data.documents.map((member, idx) => (
            <React.Fragment key={member.$id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  name={member.name}
                  className="size-10"
                  fallbackClassName="text-lg"
                />

                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" variant="secondary" size="icon">
                      <MoreVerticalIcon className="siz-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMemberRole(member.$id, MemberRole.ADMIN)
                      }
                      disabled={isPending}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMemberRole(member.$id, MemberRole.MEMBER)
                      }
                      disabled={isPending}
                    >
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-amber-700"
                      onClick={() => handleMemberRemove(member.$id)}
                      disabled={isPending}
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {idx < data.data.total - 1 && <Separator className="my-2.5" />}
            </React.Fragment>
          ))}
      </CardContent>
    </Card>
  );
};
