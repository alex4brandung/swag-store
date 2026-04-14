"use client";

import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { CloseIcon, ShoppingBagIcon } from "../icons";
import { CartItem } from "./cart-item";
import { useCart } from "./cart-context";

export function CartSheet() {
  const { optimisticCart: cart, isOpen, setIsOpen } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
        className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-dvh w-full max-w-none border-0 bg-transparent p-0 open:block [&::backdrop]:bg-transparent"
        aria-label="Shopping cart"
      >
        <aside className="absolute top-0 right-0 flex h-full min-h-0 w-full min-w-0 max-w-sm flex-col border-l border-border bg-muted text-foreground">
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

            <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-5">
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
      </dialog>
    </>
  );
}
