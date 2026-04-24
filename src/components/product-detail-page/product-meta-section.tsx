import type { Product } from "@/lib/types";
import { ProductTags } from "@/components/product-detail-page/product-tags";
import { ProductSummary } from "@/components/product-detail-page/product-summary";

type ProductMetaSectionProps = {
  product: Product;
};

export function ProductMetaSection({ product }: ProductMetaSectionProps) {
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
