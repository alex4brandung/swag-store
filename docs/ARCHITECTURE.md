# Vercel Swag Store — Architecture

This document reflects the current implementation in this repository.

## Tech Stack

| Technology | Version | Notes |
| --- | --- | --- |
| Next.js | 16.2.4 | App Router + Cache Components |
| React | 19.2.4 | Server Components + Suspense |
| TypeScript | 5.x | Strict typing |
| Tailwind CSS | 4.x | Utility-first styling |

## High-Level Structure

```
src/
  app/                       # Routes and page composition
  components/                # UI split by feature
    home-page/
    product-detail-page/
    search-page/
    cart/
    ui/
  lib/                       # API client, types, server actions, utilities
```

Key boundaries:

- `app/`: route entry points and metadata.
- `components/`: rendering and UX logic, mostly Server Components.
- `lib/api.ts`: typed external API access (products, categories, promo, cart, stock).
- `lib/cart-actions.ts`: Server Actions for cart mutations and cache invalidation.

## Route Composition

### `/`

- `PromoBanner` (cached) inside Suspense with `PromoBannerSkeleton`.
- `Hero` static section.
- `FeaturedProducts` (cached) inside Suspense with `ProductGridSkeleton`.

### `/search`

- `SearchControls` (cached categories fetch) inside Suspense.
- `SearchResults` awaits `searchParams`, then renders keyed Suspense:
  - key is `${q ?? ""}-${category ?? ""}` to force fallback on query/category changes.
  - content rendered by `SearchResultsContent`.

### `/products/[slug]`

- `generateStaticParams` builds slugs from paginated products.
- `generateMetadata` fetches product-specific SEO metadata.
- Page body renders `ProductInfoPanel`, which includes:
  - cached product meta section (`ProductMetaSection`)
  - purchase section (`ProductPurchaseSection` -> `AddToCartSection`) behind Suspense.

## Cache Components Strategy

`next.config.ts` enables `cacheComponents: true`.

Caching is applied close to usage sites. There are two layers:

1. `lib/api.ts` caches API resources where globally reusable.
2. Components add contextual caching (lifetime/tags) where view-specific.

See `docs/USE_CACHE.md` for the exact inventory.

## Server Actions and Cart Flow

`src/lib/cart-actions.ts` (`"use server"`) provides:

- `getCartAction()`
- `addToCartAction(productId, quantity, productSlug?)`
- `updateCartItemAction(productId, quantity, productSlug?)`
- `removeCartItemAction(productId, productSlug?)`

Behavior:

- Cart token is stored in `cart-token` `httpOnly` cookie.
- Cart is created lazily on first add.
- Expired/invalid tokens are cleared and retried where appropriate.
- Mutations call:
  - `updateTag(\`cart-${token}\`)` to refresh header/cart cache
  - `updateTag(\`product-stock-${...}\`)` to refresh stock cache

## Search Architecture

Search state is URL-based (`q`, `category`) for shareability and refresh persistence.

- `SearchInput`:
  - Enter submits immediately
  - Search button submits immediately
  - Debounced auto-search (400ms) when input length is `>= 3` or cleared
- `CategoryFilter`:
  - updates `category` param
  - syncs with browser navigation (`popstate`)
- `SearchResultsContent`:
  - uses `searchProducts` (delegates to `getProductsWithMeta` so the product list cache applies, including when switching `category` in the URL)
  - result limit is `5` when text search is active, otherwise `9`

## Metadata

Root metadata in `app/layout.tsx` defines:

- title template (`%s | Vercel Swag Store`)
- default description
- Open Graph + Twitter basics
- `metadataBase` derived via `getSiteUrl()`
- required generator meta tag:
  - `<meta name="generator" content="vswag-cert-v3" />`

Page-level metadata:

- `/`: static metadata export
- `/search`: static metadata export
- `/products/[slug]`: dynamic `generateMetadata`

## Server vs Client Components

Default pattern is Server Components.

Client modules are used only for interactivity and browser APIs (`useRouter`, local state, optimistic updates, event handlers). Current client modules include:

- cart: `cart-context`, `cart-sheet`, `cart-item`
- product flow: `add-to-cart-button`, `quantity-selector`
- search controls: `search-input`, `category-filter`
- theming/ui wrappers: `theme-provider`, `theme-toggle`, `ui/select`, `ui/drawer`
- errors: `error-display`, `app/error.tsx`, `app/products/[slug]/error.tsx`

## Notes on Drift Prevention

To keep docs aligned with implementation:

- update `docs/USE_CACHE.md` whenever cache tags/lifetimes/directives change
- update this file when route composition, server actions, or key component paths change

