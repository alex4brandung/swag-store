import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { PromoBanner } from "@/components/promo-banner";
import { FeaturedProducts } from "@/components/product-grid";

export const metadata: Metadata = {
  title: "Vercel Swag Store — Official Merch",
  description:
    "Shop official Vercel merchandise — premium developer apparel, accessories, and gear.",
  openGraph: {
    title: "Vercel Swag Store — Official Merch",
    description:
      "Shop official Vercel merchandise — premium developer apparel, accessories, and gear.",
  },
};

function PromoBannerSkeleton() {
  return (
    <div className="border-y border-[var(--border)] bg-[var(--muted)] py-3 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 bg-[var(--border)] rounded mx-auto w-80" />
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-[var(--border)]" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-[var(--border)] rounded w-16" />
            <div className="h-4 bg-[var(--border)] rounded w-3/4" />
            <div className="h-4 bg-[var(--border)] rounded w-16 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<PromoBannerSkeleton />}>
        <PromoBanner />
      </Suspense>

      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Featured Products
          </h2>
          <a
            href="/search"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            View all &rarr;
          </a>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts limit={6} />
        </Suspense>
      </section>
    </>
  );
}
