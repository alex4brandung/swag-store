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

type CartActionResult =
  | { success: true; cart: CartWithProducts }
  | { success: false; error: string };

const CART_TOKEN_COOKIE = "cart-token";
const MAX_QUANTITY = 99;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= MAX_QUANTITY;
}

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
): Promise<CartActionResult> {
  if (!isNonEmptyString(productId)) {
    return { success: false, error: "Invalid product ID" };
  }
  if (!isValidQuantity(quantity)) {
    return { success: false, error: "Quantity must be an integer between 1 and 99" };
  }

  try {
    const token = await ensureCart();
    const cart = await addItemToCart(token, productId, quantity);
    updateTag(`cart-${token}`);
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
): Promise<CartActionResult> {
  if (!isNonEmptyString(itemId)) {
    return { success: false, error: "Invalid item ID" };
  }
  if (!isValidQuantity(quantity)) {
    return { success: false, error: "Quantity must be an integer between 1 and 99" };
  }

  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await updateItem(token, itemId, quantity);
    updateTag(`cart-${token}`);
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
): Promise<CartActionResult> {
  if (!isNonEmptyString(itemId)) {
    return { success: false, error: "Invalid item ID" };
  }

  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await removeItem(token, itemId);
    updateTag(`cart-${token}`);
    return { success: true, cart };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove item",
    };
  }
}
