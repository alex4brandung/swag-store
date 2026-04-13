"use client";

import Image from "next/image";
import { useTransition } from "react";
import { removeCartItemAction, updateCartItemAction } from "@/lib/cart-actions";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct, CartWithProducts } from "@/lib/types";

interface CartItemProps {
  item: CartItemWithProduct;
  onCartUpdated: (cart: CartWithProducts) => void;
}

export function CartItem({ item, onCartUpdated }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleQuantityChange(newQty: number) {
    startTransition(async () => {
      const result = newQty < 1
        ? await removeCartItemAction(item.productId)
        : await updateCartItemAction(item.productId, newQty);
      if (result.success) {
        onCartUpdated(result.cart);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCartItemAction(item.productId);
      if (result.success) {
        onCartUpdated(result.cart);
      }
    });
  }

  return (
    <div
      className={`flex gap-3 py-4 border-b border-[var(--border)] ${isPending ? "opacity-50" : ""}`}
    >
      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-[var(--muted)]">
        {item.product.images[0] && (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">
          {item.product.name}
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          {formatPrice(item.product.price, item.product.currency)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isPending}
            aria-label="Decrease quantity"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50 cursor-pointer"
          >
            −
          </button>
          <span className="text-sm w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isPending}
            aria-label="Increase quantity"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {formatPrice(item.lineTotal, item.product.currency)}
        </span>
        <button
          onClick={handleRemove}
          disabled={isPending}
          aria-label="Remove item"
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 cursor-pointer"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
