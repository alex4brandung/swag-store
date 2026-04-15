# `"use cache"` Usage Map

This document lists every `"use cache"` usage in the project and explains why each location is cached.

## How this project uses Cache Components

- Next.js Cache Components are enabled in `next.config.ts` with `cacheComponents: true`.
- Caching is applied close to the data usage site (component or helper function), not globally in `lib/api.ts`.
- Function arguments are part of the cache key, so variant-specific data (for example slug, query, or cart token) is cached independently.
- `cacheTag(...)` is used for targeted invalidation; cart data is additionally invalidated with `updateTag(...)` in Server Actions.

## Inventory of `"use cache"` locations

| Location | Cached unit | Why cached | Cache controls |
| --- | --- | --- | --- |
| `src/components/product-grid.tsx` | `FeaturedProducts` component output | Featured catalog data changes infrequently and is shown on the homepage shell repeatedly. | `cacheTag("featured-products")` |
| `src/app/products/[slug]/page.tsx` | `fetchProduct(slug)` | Product detail data is read often and usually stable between requests. | `cacheLife("hours")`, `cacheTag(\`product-${slug}\`)` |
| `src/app/search/page.tsx` | `fetchCategories()` | Category list is near-static and reused for every search page render. | `cacheTag("categories")` |
| `src/components/promo-banner.tsx` | `fetchPromotion()` | Promotion payload is reused heavily and acceptable to serve with a short-lived cache window. | `cacheLife("hours")`, `cacheTag("promotion")` |
| `src/components/search-results.tsx` | `fetchSearchResults(query, category)` | Search/browse responses are expensive enough to benefit from reuse; query/category variants are naturally key-scoped by args. | `cacheTag("search-results")` |
| `src/components/header.tsx` | `fetchCachedCart(token)` | Header cart summary is reused per cart token and can be explicitly invalidated after mutations. | `cacheTag(token ? \`cart-${token}\` : "cart")` |
| `src/components/footer.tsx` | `Footer` component (file-level `"use cache"`) | Footer includes `new Date()`; caching keeps footer in the static shell and avoids per-request recomputation. | `cacheLife("days")` |

## Where we intentionally do **not** cache

- `src/components/add-to-cart-section.tsx` calls `getProductStock(slug)` without `"use cache"` because stock should stay request-fresh for purchase decisions.

## Cart invalidation flow

Cart mutations in `src/lib/cart-actions.ts` call `updateTag(\`cart-${token}\`)` after successful writes.  
That invalidates `fetchCachedCart(token)` in the header so the next render gets current cart totals.
