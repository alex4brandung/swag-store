# `"use cache"` Usage Map

This file documents every current cache entry point and related invalidation tag.

## Global cache setup

- Cache Components are enabled via `next.config.ts` (`cacheComponents: true`).
- Function arguments are part of the cache key.
- `cacheTag(...)` and `updateTag(...)` are used for targeted invalidation.

## Current `"use cache"` locations

### `src/lib/api.ts`

| Function | Purpose | Cache controls |
| --- | --- | --- |
| `getProductsWithMeta(params)` | Product list fetching (homepage/search/static params) | `cacheLife("minutes")`, `cacheTag("products")`, optional category/featured tags |
| `searchProducts(params)` | Search page list (same API as `getProductsWithMeta`) | delegates to `getProductsWithMeta` — shared cache, so category / query combinations revalidate with the `minutes` profile |
| `getProduct(idOrSlug)` | Product detail fetch | `cacheLife("hours")`, `cacheTag("products")`, `cacheTag(\`product:${...}\`)` |
| `getCategories()` | Categories for search filters | `cacheLife("days")`, `cacheTag("categories")` |
| `getPromotion()` | Promotion banner payload | `cacheLife("hours")`, `cacheTag("promotions")` |

### `src/components`

| Location | Cached unit | Cache controls |
| --- | --- | --- |
| `home-page/featured-products.tsx` | `FeaturedProducts` render/data slice | `cacheLife("minutes")`, `cacheTag("products")`, `cacheTag("products:featured:true")` |
| `home-page/promo-banner.tsx` | `PromoBanner` render/data slice | `cacheLife("hours")`, `cacheTag("promotions")` |
| `product-detail-page/product-info-panel.tsx` | `ProductMetaSection` (summary/tags) | `cacheLife("hours")`, `cacheTag("products")`, product tag |
| `add-to-cart-section.tsx` | `getCachedProductStock(productId, slug)` | `cacheLife("seconds")`, `cacheTag(\`product-stock-${productId}\`)`, `cacheTag(\`product-stock-${slug}\`)` |
| `search-page/search-controls.tsx` | `SearchControls` category fetch/render | `cacheLife("days")`, `cacheTag("categories")` |
| `header.tsx` | `fetchCachedCart(token)` | `cacheTag(token ? \`cart-${token}\` : "cart")` |
| `footer.tsx` | `Footer` output (year/date usage) | `cacheLife("days")` |

## Intentionally not cached

| Location | Reason |
| --- | --- |
| `search-page/search-results-content.tsx` | The async component has no extra `"use cache"` wrapper; list data is still cached via `searchProducts` → `getProductsWithMeta` (per request args, `cacheLife("minutes")`). |
| Cart write operations in `lib/cart-actions.ts` | Mutations must execute fresh and then invalidate affected tags. |

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

- Some data is cached at both API helper and component levels intentionally:
  - API-level caching makes data reusable.
  - Component-level caching allows view-specific lifetimes/tags.
- If a tag name changes in code, update this file and `docs/ARCHITECTURE.md` in the same PR.
