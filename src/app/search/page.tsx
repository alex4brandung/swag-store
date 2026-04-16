import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SearchContent } from "@/components/search-page/search-content";
import { SearchControlsSkeleton } from "@/components/search-page/search-controls-skeleton";
import { SearchHeaderSkeleton } from "@/components/search-page/search-header-skeleton";
import type { SearchParams } from "@/components/search-page/types";

interface Props {
  searchParams: Promise<SearchParams>;
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

function SearchPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <SearchHeaderSkeleton />
      <SearchControlsSkeleton />
      <ProductGridSkeleton />
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
