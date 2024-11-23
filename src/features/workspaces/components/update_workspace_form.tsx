"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditWorkspaceFormData, editWorkspaceSchema } from "../schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/mutations/use_update_workspace";
import { Workspace } from "@/lib/types";
import { useConfirm } from "@/hooks/use_confirm";
import { useDeleteWorkspace } from "../api/mutations/use_delete_workspace";
import { CopyIcon } from "@radix-ui/react-icons";
import { useResetInviteCode } from "../api/mutations/use_reset_invite_code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValue,
}: EditWorkspaceFormProps) => {
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { mutate: resetInviteCode, isPending: isResetingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete Workspace",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const [ResetInviteCodeDialog, confirmResetInvitCode] = useConfirm({
    title: "Reset invite link",
    message: "This will invalidate the current invite link",
    variant: "destructive",
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<EditWorkspaceFormData>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: {
      name: initialValue.name,
      image: initialValue.imageUrl ?? "",
    },
    disabled: isPending || isDeletingWorkspace,
  });

  const router = useRouter();

  const handleDelete = async () => {
    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    deleteWorkspace(
      { param: { workspaceId: initialValue.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  };

  const onSubmit = (data: EditWorkspaceFormData) => {
    data = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };

    updateWorkspace(
      { form: data, param: { workspaceId: initialValue.$id } },
      {
        onSettled: (resp, err) => {
          if (err || !resp?.success) {
            return toast.error(resp?.message ?? String(err));
          }

          //redirect to the new workspace
          router.push(`/workspaces/${resp.data.$id}`);
          toast.success("workspace created sucessfully");
          form.reset();
        },
      },
    );
  };

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(e.target.files ?? []);
    if (!file) {
      return;
    }

    form.setValue("image", file);
  }

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValue.$id}/join/${initialValue.inviteCode}`;

  const handleCopyInviteCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullInviteLink);
      toast.success("Invite code copied to the clipboard");
    } catch {
      toast.error("An error occurred while copying invite");
    }
  };

  const handleResetInviteCode = async () => {
    const shouldResetInviteCode = await confirmResetInvitCode();
    if (!shouldResetInviteCode) {
      return;
    }

    resetInviteCode(
      { param: { workspaceId: initialValue.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  return (
    <>
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <div className="flex flex-col gap-y-4">
        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={
                onCancel
                  ? onCancel
                  : () => router.push(`/workspaces/${initialValue.$id}`)
              }
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl font-bold">
              {initialValue.name}
            </CardTitle>
          </CardHeader>

          <div className="px-7">
            <DottedSeparator />
          </div>

          <CardContent className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter workspace name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                fill
                                className="object-cover"
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="Logo"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex flex-col">
                            <p className="text-sm">Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 1mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .jpeg, .png, .svg"
                              ref={inputRef}
                              onChange={handleImageUpload}
                              disabled={isPending}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant="destructive"
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current?.value) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove Image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant="tertiary"
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload Image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <DottedSeparator className="py-7" />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" size="lg" disabled={isPending}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Invite Members</h3>
              <p className="text-sm text-muted-foreground">
                Use the invite link to add members to your workspaces
              </p>

              <div className="mt-4">
                <div className="flex items-center gap-x-2">
                  <Input disabled value={fullInviteLink} />
                  <Button
                    onClick={handleCopyInviteCopy}
                    variant="secondary"
                    className="size-12"
                  >
                    <CopyIcon className="size-5" />
                  </Button>
                </div>
              </div>

              <DottedSeparator className="p-7" />
              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isResetingInviteCode || isDeletingWorkspace}
                onClick={handleResetInviteCode}
              >
                Reset invite link
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting a workspace is irreversible and wiill remove all
                associated data.
              </p>

              <DottedSeparator className="p-7" />
              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isPending}
                onClick={handleDelete}
              >
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
