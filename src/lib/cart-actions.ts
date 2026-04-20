"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import {
  addItemToCart,
  createCart,
  getCart as fetchCart,
  isCartTokenInvalidError,
  removeCartItem as removeItem,
  updateCartItem as updateItem,
} from "@/lib/api";
import type { CartWithProducts } from "@/lib/types";

type CartActionResult =
  | { success: true; cart: CartWithProducts }
  | { success: false; error: string };

const CART_TOKEN_COOKIE = "cart-token";
const MAX_QUANTITY = 99;
const CART_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function updateProductStockTags(
  productId: string,
  productSlug?: string,
): void {
  updateTag(`product-stock-${productId}`);
  if (isNonEmptyString(productSlug)) {
    updateTag(`product-stock-${productSlug}`);
  }
}

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

async function persistCartToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_TOKEN_MAX_AGE_SECONDS,
  });
}

async function clearCartToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_TOKEN_COOKIE);
}

async function createAndPersistCart(): Promise<string> {
  const { token } = await createCart();
  await persistCartToken(token);
  return token;
}

async function ensureCart(options?: { forceNew?: boolean }): Promise<string> {
  const cookieStore = await cookies();
  const forceNew = options?.forceNew ?? false;
  const existing = cookieStore.get(CART_TOKEN_COOKIE)?.value;
  if (existing && !forceNew) return existing;

  return createAndPersistCart();
}

export async function getCartAction(): Promise<CartWithProducts | null> {
  const token = await getCartToken();
  if (!token) return null;
  try {
    return await fetchCart(token);
  } catch (error) {
    if (isCartTokenInvalidError(error)) {
      await clearCartToken();
    }
    return null;
  }
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  productSlug?: string,
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
    updateProductStockTags(productId, productSlug);
    return { success: true, cart };
  } catch (err) {
    if (isCartTokenInvalidError(err)) {
      try {
        await clearCartToken();
        const freshToken = await ensureCart({ forceNew: true });
        const cart = await addItemToCart(freshToken, productId, quantity);
        updateTag(`cart-${freshToken}`);
        updateProductStockTags(productId, productSlug);
        return { success: true, cart };
      } catch (retryError) {
        return {
          success: false,
          error:
            retryError instanceof Error
              ? retryError.message
              : "Failed to add to cart",
        };
      }
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add to cart",
    };
  }
}

export async function updateCartItemAction(
  productId: string,
  quantity: number,
  productSlug?: string,
): Promise<CartActionResult> {
  if (!isNonEmptyString(productId)) {
    return { success: false, error: "Invalid product ID" };
  }
  if (!isValidQuantity(quantity)) {
    return { success: false, error: "Quantity must be an integer between 1 and 99" };
  }

  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await updateItem(token, productId, quantity);
    updateTag(`cart-${token}`);
    updateProductStockTags(productId, productSlug);
    return { success: true, cart };
  } catch (err) {
    if (isCartTokenInvalidError(err)) {
      await clearCartToken();
      return {
        success: false,
        error: "Your cart expired. Please add an item again.",
      };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update cart",
    };
  }
}

export async function removeCartItemAction(
  productId: string,
  productSlug?: string,
): Promise<CartActionResult> {
  if (!isNonEmptyString(productId)) {
    return { success: false, error: "Invalid product ID" };
  }

  try {
    const token = await getCartToken();
    if (!token) return { success: false, error: "No cart found" };
    const cart = await removeItem(token, productId);
    updateTag(`cart-${token}`);
    updateProductStockTags(productId, productSlug);
    return { success: true, cart };
  } catch (err) {
    if (isCartTokenInvalidError(err)) {
      await clearCartToken();
      return {
        success: false,
        error: "Your cart expired. Please add an item again.",
      };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove item",
    };
  }
}
