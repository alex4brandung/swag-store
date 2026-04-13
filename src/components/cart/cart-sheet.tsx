"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { CartWithProducts } from "@/lib/types";
import { CartItem } from "./cart-item";

interface CartSheetProps {
  initialCart: CartWithProducts | null;
}

export function CartSheet({ initialCart }: CartSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartWithProducts | null>(initialCart);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCartUpdated = useCallback(
    (next: CartWithProducts) => {
      setCart(next);
      router.refresh();
    },
    [router]
  );

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
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#171719] text-[10px] font-bold leading-none">
            {(cart?.totalItems ?? 0) > 99 ? "99+" : cart?.totalItems}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-dvh w-full max-w-none border-0 bg-transparent p-0 open:flex open:flex-col [&::backdrop]:bg-transparent"
        aria-label="Shopping cart"
      >
        <div className="flex min-h-0 flex-1 flex-row">
          <div
            className="min-h-0 min-w-0 flex-1 bg-black/45 backdrop-blur-md"
            aria-hidden
          />
          <aside
            className="flex h-full min-h-0 w-full max-w-sm flex-col border-l border-border bg-[#1c1c1f]"
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
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <ShoppingBagIcon />
                  <p className="text-sm text-muted-foreground">
                    Your cart is empty
                  </p>
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
                  className="w-full rounded-lg bg-white text-[#171719] font-semibold py-3 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
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

function ShoppingBagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
