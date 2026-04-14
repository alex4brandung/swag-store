"use client";

import { ErrorDisplay } from "@/components/error-display";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      statusCode="500"
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
      linkHref="/"
      linkLabel="Go home"
    />
  );
}
