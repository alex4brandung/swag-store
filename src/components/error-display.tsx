"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorDisplayProps = {
  error: Error & { digest?: string };
  reset: () => void;
  statusCode: string;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
};

export function ErrorDisplay({
  error,
  reset,
  statusCode,
  title,
  description,
  linkHref,
  linkLabel,
}: ErrorDisplayProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold text-border">{statusCode}</span>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} className="px-5 py-2.5">
          Try again
        </Button>
        <Link
          href={linkHref}
          className="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 text-sm hover:bg-muted transition-colors"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
