import { SearchEmptyIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { getProductsWithMeta } from "@/lib/api";
import { getSearchPageProductLimit } from "./utils/search-list-limit";
import { normalizeSearchParam } from "./utils/normalize-search-param";
import type { SearchParams } from "./types";

interface SearchResultsProps {
  searchParams: Promise<SearchParams>;
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const { q, category } = await searchParams;
  const query = normalizeSearchParam(q);
  const normalizedCategory = normalizeSearchParam(category);
  const { products } = await getProductsWithMeta({
    search: query || undefined,
    category: normalizedCategory || undefined,
    limit: getSearchPageProductLimit(Boolean(query)),
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
          <SearchEmptyIcon className="text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {query
              ? `No results for "${query}". Try a different search term.`
              : "No products match the selected filters."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
