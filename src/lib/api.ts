import type {
  ApiResponse,
  CartWithProducts,
  Category,
  PaginationMeta,
  Product,
  Promotion,
  StockInfo,
} from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

const ENABLE_API_TIMINGS = process.env.SWAG_DEBUG_TIMINGS === "1";

class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function getRequestMethod(options: RequestInit): string {
  const method = options.method?.trim().toUpperCase();
  return method && method.length > 0 ? method : "GET";
}

function logApiTiming(
  method: string,
  path: string,
  durationMs: number,
  status?: number,
): void {
  if (!ENABLE_API_TIMINGS) return;
  const statusPart = typeof status === "number" ? ` ${status}` : "";
  console.info(
    `[swag-store][api] ${method} ${path}${statusPart} ${durationMs}ms`,
  );
}

function getSwagApiEnv(): { baseUrl: string; bypassToken: string } {
  const baseUrl = process.env.SWAG_API_BASE_URL?.trim() ?? "";
  const bypassToken = process.env.SWAG_API_BYPASS_TOKEN?.trim() ?? "";
  const missing: string[] = [];
  if (!baseUrl) missing.push("SWAG_API_BASE_URL");
  if (!bypassToken) missing.push("SWAG_API_BYPASS_TOKEN");

  if (missing.length > 0) {
    console.warn(
      "[swag-store] Missing environment variable(s):",
      missing.join(", "),
      "— set them in .env.local or Vercel → Project → Settings → Environment Variables.",
    );
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  return { baseUrl, bypassToken };
}

async function apiRawFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<{
  data: T;
  response: Response;
  meta?: { pagination?: PaginationMeta };
}> {
  const { baseUrl, bypassToken } = getSwagApiEnv();
  const url = `${baseUrl}${path}`;
  const method = getRequestMethod(options);
  const startedAt = Date.now();
  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "x-vercel-protection-bypass": bypassToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    logApiTiming(method, path, Date.now() - startedAt);
    throw error;
  }

  logApiTiming(method, path, Date.now() - startedAt, res.status);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
    const message =
      body && !body.success ? body.error.message : `HTTP ${res.status}`;
    throw new ApiRequestError(message, res.status);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error.message);
  }
  return { data: body.data, response: res, meta: body.meta };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { data } = await apiRawFetch<T>(path, options);
  return data;
}

// ── Products ────────────────────────────────────────────────────────

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

function buildListProductsQuery(params: ListProductsParams): string {
  const qs = new URLSearchParams();
  if (params.page != null) qs.set("page", String(params.page));
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.featured != null) qs.set("featured", String(params.featured));
  return qs.toString();
}

function toTagSegment(value: string): string {
  return encodeURIComponent(value.trim().toLowerCase());
}

export interface ListProductsWithMetaResult {
  products: Product[];
  pagination?: PaginationMeta;
}

export async function getProductsWithMeta(
  params: ListProductsParams = {},
): Promise<ListProductsWithMetaResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  if (params.category) {
    cacheTag(`products:category:${toTagSegment(params.category)}`);
  }
  if (params.featured != null) {
    cacheTag(`products:featured:${params.featured ? "true" : "false"}`);
  }
  const query = buildListProductsQuery(params);
  const { data, meta } = await apiRawFetch<Product[]>(
    `/products${query ? `?${query}` : ""}`,
  );
  return { products: data, pagination: meta?.pagination };
}

export async function getProducts(
  params: ListProductsParams = {},
): Promise<Product[]> {
  const { products } = await getProductsWithMeta(params);
  return products;
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  cacheTag(`product:${toTagSegment(idOrSlug)}`);
  let product: Product;
  try {
    product = await apiFetch<Product>(
      `/products/${encodeURIComponent(idOrSlug)}`,
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
  return product;
}

// ── Stock ───────────────────────────────────────────────────────────

export async function getProductStock(idOrSlug: string): Promise<StockInfo> {
  return apiFetch<StockInfo>(`/products/${encodeURIComponent(idOrSlug)}/stock`);
}

// ── Categories ──────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  return apiFetch<Category[]>("/categories");
}

// ── Promotions ──────────────────────────────────────────────────────

export async function getPromotion(): Promise<Promotion> {
  "use cache";
  cacheLife("hours");
  cacheTag("promotions");
  return apiFetch<Promotion>("/promotions");
}

// ── Cart ────────────────────────────────────────────────────────────

export async function createCart(): Promise<{
  cart: CartWithProducts;
  token: string;
}> {
  const { data, response } = await apiRawFetch<CartWithProducts>(
    "/cart/create",
    { method: "POST" },
  );

  const token = response.headers.get("x-cart-token");
  if (!token) {
    throw new Error("No cart token in response");
  }

  return { cart: data, token };
}

export async function getCart(cartToken: string): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>("/cart", {
    headers: { "x-cart-token": cartToken },
  });
}

export async function addItemToCart(
  cartToken: string,
  productId: string,
  quantity: number,
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
  quantity: number,
): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    headers: { "x-cart-token": cartToken },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(
  cartToken: string,
  itemId: string,
): Promise<CartWithProducts> {
  return apiFetch<CartWithProducts>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    headers: { "x-cart-token": cartToken },
  });
}
