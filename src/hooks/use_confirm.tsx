import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive_modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePromise } from "react-use";

type UseConfirmProps = {
  title: string;
  message: string;
  variant: ButtonProps["variant"];
};

export const useConfirm = ({
  title,
  message,
  variant = "primary",
}: UseConfirmProps): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (confirm: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((res) => {
      setPromise({ resolve: res });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal open={!!promise} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>

            <div
              className="pt-4 w-full flex flex-col gap-y-2
              lg:flex-row gap-x-2 items-center justify-end"
            >
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={handleConfirm}
                variant={variant}
                className="w-full lg:w-auto"
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };

  return [ConfirmationDialog, confirm];
};
