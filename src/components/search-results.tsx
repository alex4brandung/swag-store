import { cacheLife, cacheTag } from "next/cache";
import { listProductsWithMeta } from "@/lib/api";
import { SearchEmptyIcon } from "@/components/icons";
import { ProductCard } from "./product-card";

interface SearchResultsProps {
  query?: string;
  category?: string;
}

async function fetchSearchResults(query?: string, category?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("search-results");
  const hasActiveSearch = Boolean(query || category);
  const { products, pagination } = await listProductsWithMeta({
    search: query || undefined,
    category: category || undefined,
    limit: hasActiveSearch ? 5 : 9,
  });
  return {
    products,
    total: pagination?.total ?? products.length,
  };
}

export async function SearchResultsCount({ query, category }: SearchResultsProps) {
  const { total } = await fetchSearchResults(query, category);
  return (
    <span className="text-sm font-normal text-muted-foreground">
      {" "}— {total} result{total !== 1 ? "s" : ""}
    </span>
  );
}

export async function SearchResults({ query, category }: SearchResultsProps) {
  const { products } = await fetchSearchResults(query, category);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
          <SearchEmptyIcon className="text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            No products found
          </p>
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
