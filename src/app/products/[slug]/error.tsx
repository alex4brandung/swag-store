"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold text-border">Error</span>
        <h1 className="text-xl font-semibold text-foreground">
          Could not load product
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          We had trouble loading this product. Please try again or browse other
          products.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-accent text-accent-foreground font-semibold px-5 py-2.5 text-sm hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/search"
          className="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 text-sm hover:bg-muted transition-colors"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
