import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/api";
import { SEARCH_RESULTS_SUMMARY_MIN_HEIGHT_CLASS } from "./search-results-constants";
import { SearchResultsEmpty } from "./search-results-empty";
import { SearchResultsSummary } from "./search-results-summary";
import { getSearchPageProductLimit } from "./utils/search-list-limit";
import { normalizeSearchParam } from "./utils/normalize-search-param";

export type SearchResultsContentProps = {
  q?: string;
  category?: string;
};

export async function SearchResultsContent({
  q,
  category,
}: SearchResultsContentProps) {
  const searchQuery = normalizeSearchParam(q);
  const searchCategory = normalizeSearchParam(category);
  const { products, pagination } = await searchProducts({
    search: searchQuery || undefined,
    category: searchCategory || undefined,
    limit: getSearchPageProductLimit(Boolean(searchQuery)),
  });
  const total = pagination?.total ?? products.length;

  if (products.length === 0) {
    return <SearchResultsEmpty query={searchQuery ?? ""} />;
  }

  return (
    <>
      <section
        className={`mb-3 flex flex-col justify-center ${SEARCH_RESULTS_SUMMARY_MIN_HEIGHT_CLASS}`}
        aria-live="polite"
      >
        <SearchResultsSummary
          total={total}
          query={searchQuery ?? ""}
          category={searchCategory ?? ""}
        />
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
