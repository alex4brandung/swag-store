"use client";

import { ErrorDisplay } from "@/components/error-display";

export default function ProductErrorPage({
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
      statusCode="Error"
      title="Could not load product"
      description="We had trouble loading this product. Please try again or browse other products."
      linkHref="/search"
      linkLabel="Browse products"
    />
  );
}
