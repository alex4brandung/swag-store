import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import type { Product } from "@/lib/types";
import { ProductPurchaseSection } from "@/components/product-detail-page/product-purchase-section";
import { ProductTags } from "@/components/product-detail-page/product-tags";
import { ProductSummary } from "@/components/product-detail-page/product-summary";

type ProductInfoPanelProps = {
  product: Product;
};

function ProductPurchaseSectionFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-40 animate-pulse rounded bg-muted-foreground/15" />
      <div className="h-11 w-full sm:w-40 animate-pulse rounded-lg bg-muted-foreground/20" />
    </div>
  );
}

async function ProductMetaSection({ product }: ProductInfoPanelProps) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  cacheTag(`product:${encodeURIComponent(product.slug.toLowerCase())}`);

  return (
    <>
      <ProductSummary
        category={product.category}
        name={product.name}
        description={product.description}
        price={product.price}
        currency={product.currency}
      />
      <ProductTags tags={product.tags} />
    </>
  );
}

export async function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProductMetaSection product={product} />
      <Suspense fallback={<ProductPurchaseSectionFallback />}>
        <ProductPurchaseSection productId={product.id} slug={product.slug} />
      </Suspense>
    </div>
  );
}
