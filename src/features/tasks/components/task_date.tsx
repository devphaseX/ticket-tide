import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: Date;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColour = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColour = "text-red-500";
  } else if (diffInDays <= 7) {
    textColour = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColour = "text-yellow-500";
  }
  return (
    <div className={textColour}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
};
