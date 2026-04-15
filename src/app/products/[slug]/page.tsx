import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, listProductsWithMeta } from "@/lib/api";
import { ProductBreadcrumb } from "@/components/product-detail-page/product-breadcrumb";
import { ProductImagePanel } from "@/components/product-detail-page/product-image-panel";
import { ProductInfoPanel } from "@/components/product-detail-page/product-info-panel";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ProductPageContentProps {
  slug: string;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const pageSize = 100;
  const { products: firstPageProducts, pagination } =
    await listProductsWithMeta({
      page: 1,
      limit: pageSize,
    });

  const allProducts = [...firstPageProducts];
  const totalPages = pagination?.totalPages ?? 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const { products } = await listProductsWithMeta({
      page,
      limit: pageSize,
    });
    allProducts.push(...products);
  }

  return Array.from(new Set(allProducts.map((product) => product.slug))).map(
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageContent slug={slug} />;
}

async function ProductPageContent({ slug }: ProductPageContentProps) {
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductBreadcrumb
        category={product.category}
        productName={product.name}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductImagePanel
          imageUrl={product.images[0]}
          productName={product.name}
        />
        <ProductInfoPanel product={product} />
      </div>
    </div>
  );
}
