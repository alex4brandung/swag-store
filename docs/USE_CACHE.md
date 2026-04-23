# `"use cache"` Usage Map

This file documents every current cache entry point and related invalidation tag.

## Data layer vs UI layer

| Prefer | When |
| --- | --- |
| **Data in `lib/api.ts` (or a small `lib/*-cache.ts` helper)** | HTTP fetches you reuse across routes/components. One `cacheLife` + `cacheTag` story, shared by `getX()` callers. |
| **Component-level `"use cache"`** | (1) The **raw data is not** (or should not be) cached in `api`—e.g. **cart** is read in the header and must be tagged per session token. (2) A **different lifetime** than the API is required and you are not double-caching the same resource. (3) **Markup-only** shell with no fetch, e.g. footer year, to avoid re-rendering a static subtree. |
| **Avoid** | Stacking `"use cache"` on a component that only **re-renders data already** returned from a cached `getX()` with the same tags and similar `cacheLife`—it adds little and confuses invalidation. |

In this repo, product list, product detail, categories, and promotion **data** are cached in `api.ts`. **Stock** and **cart** use small component-level (or colocated) cached helpers because their lifetimes and tags differ from catalog data.

## Global cache setup

- Cache Components are enabled via `next.config.ts` (`cacheComponents: true`).
- Function arguments are part of the cache key.
- `cacheTag(...)` and `updateTag(...)` are used for targeted invalidation.

## Current `"use cache"` locations

### `src/lib/api.ts`

| Function                      | Purpose                                               | Cache controls                                                                                                            |
| ----------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `getProductsWithMeta(params)` | Product list fetching (homepage/search/static params) | `cacheLife("minutes")`, `cacheTag("products")`, optional category/featured tags                                           |
| `searchProducts(params)`      | Search page list (same API as `getProductsWithMeta`)  | delegates to `getProductsWithMeta` — shared cache, so category / query combinations revalidate with the `minutes` profile |
| `getProduct(idOrSlug)`        | Product detail fetch                                  | `cacheLife("hours")`, `cacheTag("products")`, `cacheTag(\`product:${...}\`)`                                              |
| `getCategories()`             | Categories for search filters                         | `cacheLife("days")`, `cacheTag("categories")`                                                                             |
| `getPromotion()`              | Promotion banner payload                              | `cacheLife("hours")`, `cacheTag("promotions")`                                                                            |

### `src/components`

| Location                          | Cached unit                    | Cache controls                                                                                            |
| --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `add-to-cart-section.tsx`         | `getCachedProductStock(…)`     | `cacheLife("seconds")`, `cacheTag(\`product-stock-${productId}\`)`, `cacheTag(\`product-stock-${slug}\`)` |
| `header.tsx`                      | `fetchCachedCart(token)`      | `cacheTag(token ? \`cart-${token}\` : "cart")` (no `getCart` in `api`—per-token read + `updateTag` on cart actions) |
| `footer.tsx`                      | `Footer` output (layout shell) | `cacheLife("days")` (no API; optional static shell)                                                        |

## Intentionally not cached

| Location                                       | Reason                                                                                                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search-page/search-results-content.tsx`       | No component wrapper; list data uses `searchProducts` → `getProductsWithMeta`.                                                                                           |
| `home-page/featured-products.tsx`, `promo-banner.tsx`, `product-detail-page/product-info-panel.tsx`, `search-page/search-controls.tsx` | Product copy, promotions, categories, PDP meta: rely on **`getProducts` / `getProduct` / `getPromotion` / `getCategories`** in `api.ts`; no duplicate UI-level cache.      |
| Cart write operations in `lib/cart-actions.ts` | Mutations must execute fresh and then invalidate affected tags.                                                                                                            |

## Invalidation map (`updateTag`)

### Cart tags

- `updateTag(\`cart-${token}\`)` is called after:
  - `addToCartAction`
  - `updateCartItemAction`
  - `removeCartItemAction`

This invalidates header cart cache (`fetchCachedCart`) for that token.

### Stock tags

- `updateTag(\`product-stock-${productId}\`)`
- `updateTag(\`product-stock-${productSlug}\`)` when slug is available

These invalidate the stock cache created in `add-to-cart-section.tsx`.

## Practical notes

- Prefer **one** cache boundary per resource (usually `lib/api.ts`). Add component-level `"use cache"` only when tags/lifetime genuinely differ—see **Data layer vs UI layer** above.
- If a tag name changes in code, update this file and `docs/ARCHITECTURE.md` in the same PR.
