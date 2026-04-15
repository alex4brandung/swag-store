import type { Product } from "@/lib/types";
import { ProductPurchaseSection } from "@/components/product-detail-page/product-purchase-section";
import { ProductTags } from "@/components/product-detail-page/product-tags";
import { ProductSummary } from "@/components/product-detail-page/product-summary";

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProductSummary
        category={product.category}
        name={product.name}
        description={product.description}
        price={product.price}
        currency={product.currency}
      />

      <ProductPurchaseSection productId={product.id} slug={product.slug} />
      <ProductTags tags={product.tags} />
    </div>
  );
}
