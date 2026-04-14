"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartWithProducts } from "@/lib/types";

interface CartContextValue {
  cart: CartWithProducts | null;
  setCart: (cart: CartWithProducts | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: (cart: CartWithProducts) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback((next: CartWithProducts) => {
    setCart(next);
    setIsOpen(true);
  }, []);

  return (
    <CartContext value={{ cart, setCart, isOpen, setIsOpen, openCart }}>
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
