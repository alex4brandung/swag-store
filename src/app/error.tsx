"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold text-border">500</span>
        <h1 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-white text-[#171719] font-semibold px-5 py-2.5 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 text-sm hover:bg-muted transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
