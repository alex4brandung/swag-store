"use client";

import { useState, useTransition } from "react";
import { QuantitySelector } from "./quantity-selector";

interface AddToCartButtonProps {
  productId: string;
  maxStock: number;
  inStock: boolean;
  addToCartAction: (
    productId: string,
    quantity: number
  ) => Promise<{ success: boolean; error?: string }>;
}

export function AddToCartButton({
  productId,
  maxStock,
  inStock,
  addToCartAction,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleAddToCart() {
    startTransition(async () => {
      setFeedback(null);
      const result = await addToCartAction(productId, quantity);
      if (result.success) {
        setFeedback({ type: "success", message: "Added to cart!" });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({
          type: "error",
          message: result.error ?? "Something went wrong",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {inStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted-foreground)]">
            Quantity
          </span>
          <QuantitySelector
            value={quantity}
            max={maxStock}
            onChange={setQuantity}
            disabled={isPending || !inStock}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock || isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#171719] font-semibold px-8 py-3 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? (
          <>
            <SpinnerIcon />
            Adding...
          </>
        ) : !inStock ? (
          "Out of Stock"
        ) : (
          "Add to Cart"
        )}
      </button>

      {feedback && (
        <p
          className={`text-sm font-medium ${
            feedback.type === "success" ? "text-green-400" : "text-red-400"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
