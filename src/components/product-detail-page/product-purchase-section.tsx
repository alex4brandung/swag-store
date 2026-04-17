import { AddToCartSection } from "@/components/add-to-cart-section";

type ProductPurchaseSectionProps = {
  productId: string;
  slug: string;
};

export function ProductPurchaseSection({
  productId,
  slug,
}: ProductPurchaseSectionProps) {
  return <AddToCartSection productId={productId} slug={slug} />;
}
