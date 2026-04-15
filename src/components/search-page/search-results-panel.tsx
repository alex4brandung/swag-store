import { SearchResults } from "@/components/search-results";
import { normalizeSearchParam } from "./normalize-search-param";
import type { SearchSectionProps } from "./types";

export async function SearchResultsPanel({ searchParams }: SearchSectionProps) {
  const { q, category } = await searchParams;
  const query = normalizeSearchParam(q);
  const normalizedCategory = normalizeSearchParam(category);

  return <SearchResults query={query} category={normalizedCategory} />;
}
