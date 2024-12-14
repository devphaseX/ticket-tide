import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import QueryProvider from "@/providers/query";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticket tide",
  description: "task orchestrator platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Toaster />
        <QueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
