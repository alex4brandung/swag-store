"use client";

import { useState } from "react";
import { addToCartAction } from "@/lib/cart-actions";
import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart/cart-context";
import { QuantitySelector } from "./quantity-selector";

type AddToCartButtonProps = {
  productId: string;
  productSlug: string;
  maxStock: number;
  inStock: boolean;
};

export function AddToCartButton({
  productId,
  productSlug,
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
    const result = await addToCartAction(productId, quantity, productSlug);
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

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || isLoading}
        aria-label={!inStock ? "Add to cart — out of stock" : undefined}
        className="w-full px-8 py-3 sm:w-auto"
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            Adding...
          </>
        ) : (
          "Add to Cart"
        )}
      </Button>

      {error && (
        <p className="text-sm font-medium text-danger-foreground" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
