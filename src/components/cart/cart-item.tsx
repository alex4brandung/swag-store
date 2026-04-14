"use client";

import Image from "next/image";
import { useTransition } from "react";
import { removeCartItemAction, updateCartItemAction } from "@/lib/cart-actions";
import { TrashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/lib/types";
import { useCart } from "./cart-context";

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const { setCart, applyOptimistic } = useCart();
  const [isPending, startTransition] = useTransition();

  function handleQuantityChange(newQty: number) {
    startTransition(async () => {
      if (newQty < 1) {
        applyOptimistic({ type: "remove_item", productId: item.productId });
        const result = await removeCartItemAction(item.productId);
        if (result.success) setCart(result.cart);
      } else {
        applyOptimistic({
          type: "update_quantity",
          productId: item.productId,
          quantity: newQty,
        });
        const result = await updateCartItemAction(item.productId, newQty);
        if (result.success) setCart(result.cart);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      applyOptimistic({ type: "remove_item", productId: item.productId });
      const result = await removeCartItemAction(item.productId);
      if (result.success) setCart(result.cart);
    });
  }

  return (
    <div className="flex gap-3 py-4 border-b border-border">
      <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
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
        <p className="text-sm font-medium text-foreground truncate">
          {item.product.name}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatPrice(item.product.price, item.product.currency)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isPending}
            aria-label="Decrease quantity"
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
          >
            −
          </button>
          <span className="text-sm w-6 text-center text-muted-foreground">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isPending}
            aria-label="Increase quantity"
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="text-sm font-medium text-foreground">
          {formatPrice(item.lineTotal, item.product.currency)}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          aria-label="Remove item"
          className="text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
