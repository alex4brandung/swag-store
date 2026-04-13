import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { PromoBanner, PromoBannerSkeleton } from "@/components/promo-banner";
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

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-muted overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-border" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-border rounded w-16" />
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-16 mt-2" />
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

      <section
        id="featured-products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-20"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-foreground">
            Featured Products
          </h2>
          <a
            href="/search"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
