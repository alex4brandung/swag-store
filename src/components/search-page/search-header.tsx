import { Suspense } from "react";
import { SearchResultsCount } from "@/components/search-results";
import { normalizeSearchParam } from "./normalize-search-param";
import type { SearchSectionProps } from "./types";

export async function SearchHeader({ searchParams }: SearchSectionProps) {
  const { q, category } = await searchParams;
  const query = normalizeSearchParam(q);
  const normalizedCategory = normalizeSearchParam(category);
  const isSearching = Boolean(query || normalizedCategory);

  return (
    <h1 className="text-2xl font-bold text-foreground mb-6">
      {isSearching ? (
        <>
          Search Results{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {[query && `for "${query}"`, normalizedCategory && `in ${normalizedCategory}`]
              .filter(Boolean)
              .join(" ")}
          </span>
          <Suspense
            fallback={
              <span className="text-sm font-normal text-muted-foreground">
                {" "}— ...
              </span>
            }
          >
            <SearchResultsCount query={query} category={normalizedCategory} />
          </Suspense>
        </>
      ) : (
        "All Products"
      )}
    </h1>
  );
}
