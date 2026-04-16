import { SearchEmptyIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/api";
import { getSearchPageProductLimit } from "./utils/search-list-limit";
import { normalizeSearchParam } from "./utils/normalize-search-param";

interface SearchResultsProps {
  query?: string;
  category?: string;
}

export async function SearchResults({
  query,
  category,
}: SearchResultsProps) {
  const searchQuery = normalizeSearchParam(query);
  const searchCategory = normalizeSearchParam(category);
  const { products } = await searchProducts({
    search: searchQuery || undefined,
    category: searchCategory || undefined,
    limit: getSearchPageProductLimit(Boolean(searchQuery)),
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
