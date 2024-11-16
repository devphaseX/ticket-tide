import { auth } from "@/features/api/server/get_current_user";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await auth();

  if (user) {
    return redirect("/");
  }

  return <SignUpCard />;
};

export default SignUpPage;
