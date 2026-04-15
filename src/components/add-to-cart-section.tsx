import { getProductStock } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";
import { AddToCartButton } from "./add-to-cart-button";
import { StockIndicator } from "./stock-indicator";
import type { StockInfo } from "@/lib/types";

interface AddToCartSectionProps {
  productId: string;
  slug: string;
}

async function getCachedProductStock(
  productId: string,
  slug: string
): Promise<StockInfo> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`product-stock-${productId}`);
  cacheTag(`product-stock-${slug}`);
  return getProductStock(slug);
}

export async function AddToCartSection({
  productId,
  slug,
}: AddToCartSectionProps) {
  let stock: StockInfo;
  try {
    stock = await getCachedProductStock(productId, slug);
  } catch {
    stock = { productId, stock: 0, inStock: false, lowStock: false };
  }

  return (
    <div className="flex flex-col gap-4">
      <StockIndicator stock={stock} />
      <AddToCartButton
        productId={productId}
        maxStock={stock.stock}
        inStock={stock.inStock}
      />
    </div>
  );
}
