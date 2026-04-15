import { AddToCartSection } from "@/components/add-to-cart-section";

interface ProductPurchaseSectionProps {
  productId: string;
  slug: string;
}

export function ProductPurchaseSection({
  productId,
  slug,
}: ProductPurchaseSectionProps) {
  return <AddToCartSection productId={productId} slug={slug} />;
}
