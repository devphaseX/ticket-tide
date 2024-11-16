import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user_button";
import { auth } from "@/features/api/server/get_current_user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/sign-in");
  }

  return <div>This is a homepage</div>;
}
