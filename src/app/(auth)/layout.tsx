"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const matchSigninPage = pathname === "/sign-in";
  const authActionText = matchSigninPage ? "Sign up" : "Login";
  const authActionPath = matchSigninPage ? "/sign-up" : "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center gap-2">
          <Image src="/icons/logo.svg" alt="logo" width={56} height={56} />
          <Button variant="secondary" asChild className="bg-white">
            <Link href={authActionPath}>{authActionText}</Link>
          </Button>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
