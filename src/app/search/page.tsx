import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchControls } from "@/components/search-page/search-controls";
import { SearchControlsSkeleton } from "@/components/search-page/search-controls-skeleton";
import {
  SearchResults,
  SearchResultsSectionSkeleton,
} from "@/components/search-page/search-results";
import type { SearchParams } from "@/components/search-page/types";

type Props = {
  searchParams: Promise<SearchParams>;
};

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
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Search products
      </h1>
      <Suspense fallback={<SearchControlsSkeleton />}>
        <SearchControls />
      </Suspense>
      <Suspense fallback={<SearchResultsSectionSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
