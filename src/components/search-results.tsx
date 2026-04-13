import { listProducts } from "@/lib/api";
import { ProductCard } from "./product-card";

interface SearchResultsProps {
  query?: string;
  category?: string;
}

export async function SearchResults({ query, category }: SearchResultsProps) {
  const isDefaultState = !query && !category;
  const limit = isDefaultState ? 12 : 5;

  const products = await listProducts({
    search: query || undefined,
    category: category || undefined,
    limit,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
          <SearchEmptyIcon />
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
    <div>
      {!isDefaultState && (
        <p className="text-sm text-muted-foreground mb-5">
          {products.length} result{products.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
          {category ? ` in ${category}` : ""}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function SearchEmptyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-muted-foreground"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
