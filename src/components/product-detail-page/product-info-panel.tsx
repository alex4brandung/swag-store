import { Suspense } from "react";
import type { Product } from "@/lib/types";
import { AddToCartSection } from "@/components/product-detail-page/add-to-cart-section";
import { AddToCartSectionSkeleton } from "@/components/product-detail-page/add-to-cart-section-skeleton";
import { ProductMetaSection } from "@/components/product-detail-page/product-meta-section";

type ProductInfoPanelProps = {
  product: Product;
};

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProductMetaSection product={product} />
      <Suspense fallback={<AddToCartSectionSkeleton />}>
        <AddToCartSection productId={product.id} slug={product.slug} />
      </Suspense>
    </div>
  );
}
