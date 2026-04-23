import { Suspense } from "react";
import type { Product } from "@/lib/types";
import { AddToCartSection } from "@/components/product-detail-page/add-to-cart-section";
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

function ProductMetaSection({ product }: ProductInfoPanelProps) {
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

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProductMetaSection product={product} />
      <Suspense fallback={<ProductPurchaseSectionFallback />}>
        <AddToCartSection productId={product.id} slug={product.slug} />
      </Suspense>
    </div>
  );
}
