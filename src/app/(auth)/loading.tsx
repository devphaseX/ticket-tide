"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader } from "lucide-react";
import Link from "next/link";

const LoadingPage = (error: unknown) => {
  return (
    <div className="h-screen flex  flex-col gap-y-4 items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
