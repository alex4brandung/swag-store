import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { AddToCartSection } from "@/components/add-to-cart-section";
import { VercelTriangle } from "@/components/icons";

interface Props {
  params: Promise<{ slug: string }>;
}


async function fetchProduct(slug: string) {
  "use cache";
  cacheTag(`product-${slug}`);
  return getProduct(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProduct(slug);
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await fetchProduct(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/search?category=${product.category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <VercelTriangle size={80} className="text-border" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          {/* Stock + Add to Cart (dynamic, streams after product shell) */}
          <Suspense
            fallback={
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-border rounded w-36" />
                <div className="h-12 bg-border rounded w-40" />
              </div>
            }
          >
            <AddToCartSection
              productId={product.id}
              slug={product.slug}
            />
          </Suspense>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="flex gap-2 mb-8">
        <div className="h-4 bg-border rounded w-10" />
        <div className="h-4 bg-border rounded w-2" />
        <div className="h-4 bg-border rounded w-16" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-square rounded-2xl bg-muted border border-border" />
        <div className="flex flex-col gap-6">
          <div className="h-3 bg-border rounded w-16" />
          <div className="h-8 bg-border rounded w-3/4" />
          <div className="h-7 bg-border rounded w-20" />
          <div className="space-y-2">
            <div className="h-4 bg-border rounded w-full" />
            <div className="h-4 bg-border rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
