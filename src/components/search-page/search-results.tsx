import { Suspense } from "react";
import type { SearchParams } from "@/components/search-page/types";
import { SearchResultsContent } from "./search-results-content";
import { SearchResultsSectionSkeleton } from "./search-results-section-skeleton";

export { SearchResultsSectionSkeleton };

/**
 * Awaits URL search params only, then renders a keyed Suspense around the fetch.
 * The key forces the fallback to show again when ?q or ?category changes (while
 * searchProducts runs). A Fragment key does not do that — only Suspense does.
 */
export async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, category } = await searchParams;
  const suspenseKey = `${q ?? ""}-${category ?? ""}`;

  return (
    <Suspense key={suspenseKey} fallback={<SearchResultsSectionSkeleton />}>
      <SearchResultsContent q={q} category={category} />
    </Suspense>
  );
}
