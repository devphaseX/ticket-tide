import { auth } from "@/features/api/server/get_current_user";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await auth();
  if (user) {
    return redirect("/");
  }

  return <SignInCard />;
};

export default SignInPage;
