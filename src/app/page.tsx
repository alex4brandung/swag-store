import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { PromoBanner, PromoBannerSkeleton } from "@/components/promo-banner";
import { FeaturedProducts } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

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
          <Link
            href="/search"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts limit={6} />
        </Suspense>
      </section>
    </>
  );
}
