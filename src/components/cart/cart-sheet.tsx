"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn, formatPrice } from "@/lib/utils";
import { CloseIcon, ShoppingBagIcon } from "../icons";
import { CartItem } from "./cart-item";
import { useCart } from "./cart-context";

export function CartSheet() {
  const { optimisticCart: cart, isOpen, setIsOpen } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
        className="relative flex cursor-pointer items-center text-foreground hover:text-foreground/80"
      >
        <ShoppingBagIcon />
        {(cart?.totalItems ?? 0) > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold leading-none text-accent-foreground">
            {(cart?.totalItems ?? 0) > 99 ? "99+" : cart?.totalItems}
          </span>
        )}
      </button>

      <Drawer
        direction="right"
        open={isOpen}
        shouldScaleBackground={false}
        onOpenChange={setIsOpen}
      >
        <DrawerContent
          className={cn(
            "flex h-dvh max-h-dvh w-full max-w-sm flex-col gap-0 rounded-none border-0 bg-muted p-0 text-foreground shadow-none",
            "before:hidden",
            "data-[vaul-drawer-direction=right]:mt-0 data-[vaul-drawer-direction=right]:max-h-dvh",
          )}
        >
          <DrawerDescription className="sr-only">
            Shopping cart contents and order summary
          </DrawerDescription>

          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <DrawerTitle className="font-heading text-base font-semibold text-foreground">
              Cart
              {cart && cart.totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({cart.totalItems}{" "}
                  {cart.totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </DrawerTitle>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close cart"
                className="text-muted-foreground hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </DrawerClose>
          </div>

          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5">
            {!cart || cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <ShoppingBagIcon />
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))
            )}
          </div>

          {cart && cart.items.length > 0 && (
            <DrawerFooter className="mt-0 shrink-0 border-t border-border px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold text-foreground">
                  {formatPrice(cart.subtotal, cart.currency)}
                </span>
              </div>
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Checkout
              </button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
