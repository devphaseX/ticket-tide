"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { EditProjectSchema, editProjectSchema } from "../project.schema";
import { useUpdateProject } from "../api/mutations/use_update_project";
import { useConfirm } from "@/hooks/use_confirm";
import { Project } from "@/lib/types";
import { useDeleteProject } from "../api/mutations/use_delete_project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use_workspace_id";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValue: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValue,
}: EditProjectFormProps) => {
  const { mutate: updateProject, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingWorkspace } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete Project",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const workspaceId = useWorkspaceId();

  const isPerformingAction = isPending || isDeletingWorkspace;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<EditProjectSchema>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: initialValue.name,
      image: initialValue.imageUrl ?? "",
    },
    disabled: isPerformingAction,
  });

  const router = useRouter();

  const handleDelete = async () => {
    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;
    deleteProject(
      { param: { projectId: initialValue.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      },
    );
  };

  const onSubmit = (data: EditProjectSchema) => {
    data = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };

    updateProject({ form: data, param: { projectId: initialValue.$id } });
  };

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(e.target.files ?? []);
    if (!file) {
      return;
    }

    form.setValue("image", file);
  }

  return (
    <>
      <DeleteDialog />
      <div className="flex flex-col gap-y-4">
        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={
                onCancel
                  ? onCancel
                  : () =>
                      router.push(
                        `/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}`,
                      )
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
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter project name" />
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
                            <p className="text-sm">Project Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 1mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .jpeg, .png, .svg"
                              ref={inputRef}
                              onChange={handleImageUpload}
                              disabled={isPerformingAction}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPerformingAction}
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
                    disabled={isPerformingAction}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" size="lg" disabled={isPerformingAction}>
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
              <h3 className="font-bold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting a project is irreversible and will remove all
                associated data.
              </p>

              <DottedSeparator className="p-7" />
              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isPerformingAction}
                onClick={handleDelete}
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
