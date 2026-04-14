"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { CartWithProducts } from "@/lib/types";
import { CloseIcon, ShoppingBagIcon } from "../icons";
import { CartItem } from "./cart-item";

interface CartSheetProps {
  initialCart: CartWithProducts | null;
}

export function CartSheet({ initialCart }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartWithProducts | null>(initialCart);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCartUpdated = useCallback((next: CartWithProducts) => {
    setCart(next);
  }, []);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
        className="relative flex items-center text-white hover:text-white/90 cursor-pointer"
      >
        <ShoppingBagIcon />
        {(cart?.totalItems ?? 0) > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold leading-none">
            {(cart?.totalItems ?? 0) > 99 ? "99+" : cart?.totalItems}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-dvh w-full max-w-none border-0 bg-transparent p-0 open:flex open:flex-col backdrop:bg-transparent"
        aria-label="Shopping cart"
      >
        <div className="flex min-h-0 flex-1 flex-row">
          <div
            className="min-h-0 min-w-0 flex-1 bg-black/45 backdrop-blur-md"
            aria-hidden
          />
          <aside
            className="flex h-full min-h-0 w-full max-w-sm flex-col border-l border-border bg-muted text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">
                Cart
                {cart && cart.totalItems > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground font-normal">
                    ({cart.totalItems}{" "}
                    {cart.totalItems === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <ShoppingBagIcon />
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onCartUpdated={handleCartUpdated}
                  />
                ))
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="px-5 py-5 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {formatPrice(cart.subtotal, cart.currency)}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-accent text-accent-foreground font-semibold py-3 text-sm hover:bg-accent/90 transition-colors cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            )}
          </aside>
        </div>
      </dialog>
    </>
  );
}
