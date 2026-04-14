"use client";

import { useState } from "react";
import { addToCartAction } from "@/lib/cart-actions";
import { SpinnerIcon } from "@/components/icons";
import { useCart } from "./cart/cart-context";
import { QuantitySelector } from "./quantity-selector";

interface AddToCartButtonProps {
  productId: string;
  maxStock: number;
  inStock: boolean;
}

export function AddToCartButton({
  productId,
  maxStock,
  inStock,
}: AddToCartButtonProps) {
  const { openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddToCart() {
    setIsLoading(true);
    setError(null);
    const result = await addToCartAction(productId, quantity);
    setIsLoading(false);
    if (result.success) {
      openCart(result.cart);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {inStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <QuantitySelector
            value={quantity}
            max={maxStock}
            onChange={setQuantity}
            disabled={isLoading || !inStock}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock || isLoading}
        aria-label={!inStock ? "Add to cart — out of stock" : undefined}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-accent-foreground font-semibold px-8 py-3 text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            Adding...
          </>
        ) : (
          "Add to Cart"
        )}
      </button>

      {error && (
        <p className="text-sm font-medium text-red-400" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
