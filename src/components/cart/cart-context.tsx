"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import type { CartWithProducts } from "@/lib/types";

export type CartOptimisticAction =
  | { type: "update_quantity"; productId: string; quantity: number }
  | { type: "remove_item"; productId: string };

type CartContextValue = {
  cart: CartWithProducts | null;
  optimisticCart: CartWithProducts | null;
  setCart: (cart: CartWithProducts | null) => void;
  applyOptimistic: (action: CartOptimisticAction) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: (cart: CartWithProducts) => void;
};

function cartReducer(
  state: CartWithProducts | null,
  action: CartOptimisticAction,
): CartWithProducts | null {
  if (!state) return state;

  switch (action.type) {
    case "update_quantity": {
      const items = state.items.map((item) =>
        item.productId === action.productId
          ? {
              ...item,
              quantity: action.quantity,
              lineTotal: item.product.price * action.quantity,
            }
          : item,
      );
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
      };
    }
    case "remove_item": {
      const items = state.items.filter(
        (item) => item.productId !== action.productId,
      );
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
      };
    }
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [optimisticCart, applyOptimistic] = useOptimistic(cart, cartReducer);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback((next: CartWithProducts) => {
    setCart(next);
    setIsOpen(true);
  }, []);

  return (
    <CartContext
      value={{
        cart,
        optimisticCart,
        setCart,
        applyOptimistic,
        isOpen,
        setIsOpen,
        openCart,
      }}
    >
      {children}
    </CartContext>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function CartInitializer({
  initialCart,
}: {
  initialCart: CartWithProducts | null;
}) {
  const { setCart } = useCart();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart, setCart]);

  return null;
}
