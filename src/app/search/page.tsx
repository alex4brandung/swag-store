import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { listCategories } from "@/lib/api";
import { SearchInput } from "@/components/search-input";
import { CategoryFilter } from "@/components/category-filter";
import { SearchResults } from "@/components/search-results";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export const metadata: Metadata = {
  title: "Search Products",
  description:
    "Search and browse all Vercel Swag Store products by name, category, and more.",
  openGraph: {
    title: "Search Products",
    description:
      "Search and browse all Vercel Swag Store products by name, category, and more.",
  },
};

async function fetchCategories() {
  "use cache";
  cacheTag("categories");
  return listCategories();
}

function SearchPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-8 bg-border rounded w-40 mb-6" />
      <div className="flex gap-3 mb-8">
        <div className="flex-1 h-11 bg-muted border border-border rounded-lg" />
        <div className="w-36 h-11 bg-muted border border-border rounded-lg" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const categories = await fetchCategories();
  const isSearching = Boolean(q || category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {isSearching ? "Search Results" : "All Products"}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Suspense>
              <SearchInput defaultValue={q ?? ""} />
            </Suspense>
          </div>
          <Suspense>
            <CategoryFilter
              categories={categories}
              selectedCategory={category ?? ""}
            />
          </Suspense>
        </div>
      </div>

      <Suspense
        key={`${q ?? ""}-${category ?? ""}`}
        fallback={<ProductGridSkeleton />}
      >
        <SearchResults query={q} category={category} />
      </Suspense>
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}
