import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SearchControls } from "@/components/search-page/search-controls";
import { SearchHeader } from "@/components/search-page/search-header";
import { SearchHeaderSkeleton } from "@/components/search-page/search-header-skeleton";
import { SearchResults } from "@/components/search-page/search-results";
import type { SearchParams } from "@/components/search-page/types";

interface SearchContentProps {
  searchParams: Promise<SearchParams>;
}

interface SearchResultsContainerProps {
  searchParams: Promise<SearchParams>;
}

function searchParamsToKey(q: string | undefined, category: string | undefined): string {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  return sp.toString();
}

async function SearchResultsContainer({
  searchParams,
}: SearchResultsContainerProps) {
  const { q, category } = await searchParams;

  return (
    <Suspense
      key={searchParamsToKey(q, category)}
      fallback={<ProductGridSkeleton />}
    >
      <SearchResults query={q} category={category} />
    </Suspense>
  );
}

export function SearchContent({ searchParams }: SearchContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<SearchHeaderSkeleton />}>
        <SearchHeader searchParams={searchParams} />
      </Suspense>
      <SearchControls />
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResultsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
