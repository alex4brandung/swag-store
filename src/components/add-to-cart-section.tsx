import { getProductStock } from "@/lib/api";
import { AddToCartButton } from "./add-to-cart-button";
import { StockIndicator } from "./stock-indicator";
import type { StockInfo } from "@/lib/types";

interface AddToCartSectionProps {
  productId: string;
  slug: string;
  addToCartAction: (
    productId: string,
    quantity: number
  ) => Promise<{ success: boolean; error?: string }>;
}

const FALLBACK_STOCK: StockInfo = {
  productId: "",
  stock: 0,
  inStock: false,
  lowStock: false,
};

export async function AddToCartSection({
  productId,
  slug,
  addToCartAction,
}: AddToCartSectionProps) {
  let stock: StockInfo;
  try {
    stock = await getProductStock(slug);
  } catch {
    stock = { ...FALLBACK_STOCK, productId };
  }

  return (
    <div className="flex flex-col gap-4">
      <StockIndicator stock={stock} />
      <AddToCartButton
        productId={productId}
        maxStock={stock.stock}
        inStock={stock.inStock}
        addToCartAction={addToCartAction}
      />
    </div>
  );
}
