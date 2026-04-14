"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import {
  addItemToCart,
  createCart,
  getCart as fetchCart,
  removeCartItem as removeItem,
  updateCartItem as updateItem,
} from "@/lib/api";
import type { CartWithProducts } from "@/lib/types";

const CART_TOKEN_COOKIE = "cart-token";

async function getCartToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_TOKEN_COOKIE)?.value ?? null;
}

async function ensureCart(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_TOKEN_COOKIE)?.value;
  if (existing) return existing;

  const { token } = await createCart();
  cookieStore.set(CART_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return token;
}

export async function getCartAction(): Promise<CartWithProducts | null> {
  const token = await getCartToken();
  if (!token) return null;
  try {
    return await fetchCart(token);
  } catch {
    return null;
  }
}

export async function addToCartAction(
  productId: string,
  quantity: number
): Promise<{ success: true; cart: CartWithProducts } | { success: false; error: string }> {
  try {
    const token = await ensureCart();
    const cart = await addItemToCart(token, productId, quantity);
    updateTag("cart");
    return { success: true, cart };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add to cart",
    };
  }
}

export async function updateCartItemAction(
  itemId: string,
  quantity: number
): Promise<{ success: true; cart: CartWithProducts } | { success: false; error: string }> {
  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await updateItem(token, itemId, quantity);
    updateTag("cart");
    return { success: true, cart };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update cart",
    };
  }
}

export async function removeCartItemAction(
  itemId: string
): Promise<{ success: true; cart: CartWithProducts } | { success: false; error: string }> {
  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await removeItem(token, itemId);
    updateTag("cart");
    return { success: true, cart };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove item",
    };
  }
}
