import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SearchControls } from "@/components/search-page/search-controls";
import { SearchHeader } from "@/components/search-page/search-header";
import { SearchHeaderSkeleton } from "@/components/search-page/search-header-skeleton";
import { SearchResults } from "@/components/search-page/search-results";
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

export default function SearchPage({ searchParams }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<SearchHeaderSkeleton />}>
        <SearchHeader searchParams={searchParams} />
      </Suspense>
      <SearchControls />
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
