import type {
  ApiResponse,
  CartWithProducts,
  Category,
  Product,
  Promotion,
  StockInfo,
} from "@/lib/types";

const BASE_URL = process.env.SWAG_API_BASE_URL!;
const BYPASS_TOKEN = process.env.SWAG_API_BYPASS_TOKEN!;

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
    const message =
      body && !body.success ? body.error.message : `HTTP ${res.status}`;
    throw new Error(message);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error.message);
  }
  return body.data;
}

// ── Products ────────────────────────────────────────────────────────

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

export async function listProducts(
  params: ListProductsParams = {}
): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.featured !== undefined)
    qs.set("featured", String(params.featured));
  const query = qs.toString();
  return apiFetch<Product[]>(`/products${query ? `?${query}` : ""}`);
}

export async function getProduct(idOrSlug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${encodeURIComponent(idOrSlug)}`);
}

// ── Stock ───────────────────────────────────────────────────────────

export async function getProductStock(idOrSlug: string): Promise<StockInfo> {
  return apiFetch<StockInfo>(
    `/products/${encodeURIComponent(idOrSlug)}/stock`
  );
}

// ── Categories ──────────────────────────────────────────────────────

export async function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

// ── Promotions ──────────────────────────────────────────────────────

export async function getPromotion(): Promise<Promotion> {
  return apiFetch<Promotion>("/promotions");
}

// ── Cart ────────────────────────────────────────────────────────────

export async function createCart(): Promise<{
  cart: CartWithProducts;
  token: string;
}> {
  const url = `${BASE_URL}/cart/create`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to create cart: HTTP ${res.status}`);
  }

  const token = res.headers.get("x-cart-token");
  if (!token) {
    throw new Error("No cart token in response");
  }

  const body = (await res.json()) as ApiResponse<CartWithProducts>;
  if (!body.success) {
    throw new Error(body.error.message);
  }

  return { cart: body.data, token };
}

export async function getCart(cartToken: string): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>("/cart", {
    headers: { "x-cart-token": cartToken },
  });
}

export async function addItemToCart(
  cartToken: string,
  productId: string,
  quantity: number
): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>("/cart", {
    method: "POST",
    headers: { "x-cart-token": cartToken },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(
  cartToken: string,
  itemId: string,
  quantity: number
): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    headers: { "x-cart-token": cartToken },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(
  cartToken: string,
  itemId: string
): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    headers: { "x-cart-token": cartToken },
  });
}
