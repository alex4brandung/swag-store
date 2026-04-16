import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";
import { CategoryFilter } from "./category-filter";
import { SearchInput } from "./search-input";

function SearchInputFallback() {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <div
          className="h-[42px] w-full rounded-lg border border-border bg-muted animate-pulse"
          aria-hidden
        />
      </div>
      <div
        className="h-[42px] w-[88px] rounded-lg bg-muted animate-pulse shrink-0"
        aria-hidden
      />
    </div>
  );
}

export async function SearchControls() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  const categories = await getCategories();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Suspense fallback={<SearchInputFallback />}>
            <SearchInput />
          </Suspense>
        </div>
        <CategoryFilter categories={categories} />
      </div>
    </div>
  );
}
