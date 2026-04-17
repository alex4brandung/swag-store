import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SEARCH_RESULTS_SUMMARY_MIN_HEIGHT_CLASS } from "./search-results-constants";

export function SearchResultsSectionSkeleton() {
  return (
    <div>
      <section
        className={`mb-3 flex flex-col justify-center ${SEARCH_RESULTS_SUMMARY_MIN_HEIGHT_CLASS}`}
        aria-hidden
      >
        <div className="h-4 w-56 max-w-full rounded bg-muted animate-pulse" />
      </section>
      <ProductGridSkeleton />
    </div>
  );
}
