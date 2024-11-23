import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
interface MemberAvatarProps {
  name: string;
  fallbackClassName?: string;
  className?: string;
}

export const MemberAvatar = ({
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border-neutral-300 rounded-full",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName,
        )}
      >
        {String.fromCodePoint(name.codePointAt(0)!).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
