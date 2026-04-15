import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductBreadcrumb } from "@/components/product-detail-page/product-breadcrumb";
import { ProductImagePanel } from "@/components/product-detail-page/product-image-panel";
import { ProductInfoPanel } from "@/components/product-detail-page/product-info-panel";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ProductPageContentProps {
  slug: string;
}

async function fetchProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`product-${slug}`);
  return getProduct(slug);
}

async function fetchProductOrNotFound(slug: string): Promise<Product> {
  try {
    return await fetchProduct(slug);
  } catch {
    notFound();
  }
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

async function ProductPageContent({ slug }: ProductPageContentProps) {
  "use cache";
  cacheLife("hours");

  const product = await fetchProductOrNotFound(slug);
  cacheTag(`product-page-${product.id}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductBreadcrumb category={product.category} productName={product.name} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductImagePanel imageUrl={product.images[0]} productName={product.name} />
        <ProductInfoPanel product={product} />
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageContent slug={slug} />;
}
