import { Button } from "@/components/ui/button";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center gap-2">
          <Image src="/icons/logo.svg" alt="logo" width={56} height={56} />
          <Button variant="secondary" className="bg-white">
            Sign up
          </Button>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
