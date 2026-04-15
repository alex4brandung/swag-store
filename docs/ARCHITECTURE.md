# Vercel Swag Store — Architecture & Pattern Documentation

This document explains the architectural decisions, patterns, and rationale behind the Vercel Swag Store implementation. It is structured to help reviewers understand **why** each pattern was chosen, not just **what** was built.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Cache Components & `"use cache"](#cache-components--use-cache)`
4. [Partial Prerendering (PPR)](#partial-prerendering-ppr)
5. [Suspense Boundaries](#suspense-boundaries)
6. [Server vs Client Component Split](#server-vs-client-component-split)
7. [Async `params` and `searchParams](#async-params-and-searchparams)`
8. [Server Actions](#server-actions)
9. [Cart Architecture](#cart-architecture)
10. [Search Architecture](#search-architecture)
11. [Metadata Strategy](#metadata-strategy)
12. [Styling Approach](#styling-approach)
13. [Data Flow Summary](#data-flow-summary)

---

## Tech Stack


| Technology   | Version | Purpose                                            |
| ------------ | ------- | -------------------------------------------------- |
| Next.js      | 16.2.1  | App Router, Cache Components, Partial Prerendering |
| React        | 19.2.4  | Server Components, `useTransition`, Suspense       |
| Tailwind CSS | 4.x     | Utility-first styling via PostCSS (no config file) |
| TypeScript   | 5.x     | Strict typing throughout                           |


No additional runtime dependencies were added. The project uses only what ships with `create-next-app`.

---

## Project Structure

```
src/
  app/                        App Router routes
    layout.tsx                Root layout (Header, Footer, metadata)
    globals.css               Tailwind v4 imports + design tokens
    page.tsx                  Homepage
    error.tsx                 Root error boundary (client)
    not-found.tsx             Custom 404 page
    products/[slug]/
      page.tsx                Product detail page (dynamic route)
      error.tsx               PDP error boundary (client)
    search/
      page.tsx                Search/browse page
  components/                 Shared UI components
    header.tsx                Sticky header with nav + cart icon
    footer.tsx                Footer with copyright year (cached)
    hero.tsx                  Homepage hero section
    hero-scroll-cue.tsx       Mobile scroll-down indicator (client)
    promo-banner.tsx          Promotional banner (cached)
    product-card.tsx          Reusable product card for grids
    product-grid.tsx          Featured products grid (cached)
    product-grid-skeleton.tsx Skeleton placeholder for product grids
    stock-indicator.tsx       Stock availability badge
    quantity-selector.tsx     Numeric quantity input (client)
    add-to-cart-button.tsx    Add to cart CTA (client)
    add-to-cart-section.tsx   Combines stock fetch + cart button (server)
    search-input.tsx          Search text input with debounce (client)
    category-filter.tsx       Category dropdown filter (client)
    search-results.tsx        Server-rendered search results (cached)
    error-display.tsx         Shared error page layout (client)
    icons.tsx                 SVG icon components
    cart/
      cart-context.tsx        Cart provider + optimistic cart state (client)
      cart-sheet.tsx          Slide-out cart panel (client)
      cart-item.tsx           Individual cart line item (client)
  lib/                        Data layer
    api.ts                    Typed fetch client for the Swag Store API
    types.ts                  TypeScript interfaces for all API schemas
    cart-actions.ts           Server Actions for cart CRUD
    utils.ts                  Utility functions (price formatting)
    site-url.ts               Canonical site URL helper for metadata
```

The separation follows a clear principle: `**lib/` holds data concerns, `components/` holds UI, `app/` holds routing and page composition.**

---

## Cache Components & `"use cache"`

### What it is

Next.js 16 introduced Cache Components via the `cacheComponents: true` config flag. This replaces the older `dynamic`, `revalidate`, and `fetchCache` segment configs with a more granular, function-level caching model using the `"use cache"` directive.

### How we use it

The `"use cache"` directive is applied at the **function or component level**, not at the page level. This gives fine-grained control over exactly which data is cached and which remains dynamic.


| Cached (`"use cache"` + `cacheTag`)                  | Why                                                                                                                                                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FeaturedProducts` component (`product-grid.tsx`)    | Product catalog is relatively stable. Tagged `"featured-products"` for targeted revalidation.                                                                                                                                |
| `fetchProduct()` in PDP (`products/[slug]/page.tsx`) | Individual product info rarely changes. Uses `cacheLife("hours")`, tagged `"product-{slug}"` per product.                                                                                                                    |
| `fetchCategories()` in search page                   | Category list is near-static. Tagged `"categories"`.                                                                                                                                                                         |
| `fetchPromotion()` in `promo-banner.tsx`             | Promotions change infrequently. Uses `cacheLife("hours")`, tagged `"promotion"`. The API *may* return a different promotion on each uncached request; caching means users see a consistent banner until the cache refreshes. |
| `fetchSearchResults()` in `search-results.tsx`       | With `"use cache"`, the function arguments (`query`, `category`) automatically form part of the cache key, so each unique search is cached independently. Tagged `"search-results"` for bulk invalidation.                   |
| `fetchCachedCart()` in `header.tsx`                  | Cached per cart token (the token argument becomes part of the cache key). Tagged `"cart-{token}"` so cart mutations can invalidate it via `updateTag`.                                                                       |
| `Footer` component                                   | Uses `new Date()` which cacheComponents treats as uncached I/O. Wrapping in `"use cache"` with `cacheLife("days")` makes it part of the static shell.                                                                        |



| Not cached (dynamic)                                | Why                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `AddToCartSection` — fetches `/products/{id}/stock` | Stock levels are explicitly **real-time** per the API spec ("changes on every request"). Must remain dynamic. |


### Why not cache at the API client level?

Caching is applied at the **component level** rather than inside `lib/api.ts` because the same API endpoint (e.g., `listProducts`) may need different cache lifetimes or tags depending on context. Component-level `"use cache"` also lets Next.js cache the rendered output (not just the raw data), which is more efficient for PPR.

---

## Partial Prerendering (PPR)

All routes in the build output show as `◐ (Partial Prerender)`:

```
Route (app)           Revalidate  Expire
┌ ◐ /                        15m      1y
├ ◐ /_not-found              15m      1y
├ ◐ /products/[slug]
└ ◐ /search                  15m      1y
```

This means each page has a **static HTML shell** that is prerendered at build time, with **dynamic holes** that stream at request time. For example:

- **Homepage**: The hero section and section headings are static. The promo banner and product grid stream in via Suspense.
- **PDP**: The page skeleton is static. Product info (cached, so nearly instant) and stock availability (dynamic) stream in.
- **Search**: The page skeleton is static. The search controls and results stream based on `searchParams`.

This architecture gives the best of both worlds: instant first paint (static shell) with fresh data where it matters.

---

## Suspense Boundaries

Every async data-fetching component is wrapped in a `<Suspense>` boundary with a skeleton fallback. This is **required** by `cacheComponents: true` — Next.js 16 errors at build time if uncached data is accessed outside of Suspense.

### The `params`/`searchParams` Suspense pattern

A key pattern in this codebase: **page components do not `await params` or `searchParams` directly**. Instead, they pass the Promise into a child component wrapped in Suspense.

```tsx
// The page itself is synchronous — it renders the static shell immediately
export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />   {/* async child awaits inside Suspense */}
    </Suspense>
  );
}
```

**Why?** In Next.js 16 with `cacheComponents`, calling `await params` is considered accessing uncached/dynamic data. If this happens at the page level (outside Suspense), Next.js throws a build error because it blocks the entire page from being partially prerendered. Moving the `await` inside a Suspense boundary allows the static shell to render immediately while the dynamic content streams in.

### Suspense placement summary


| Component                        | Suspense location          | Fallback             |
| -------------------------------- | -------------------------- | -------------------- |
| `PromoBanner`                    | `page.tsx` (homepage)      | Thin animated bar    |
| `FeaturedProducts`               | `page.tsx` (homepage)      | 6-card skeleton grid |
| `ProductContent`                 | `products/[slug]/page.tsx` | Full page skeleton   |
| `AddToCartSection`               | Inside `ProductContent`    | Small skeleton block |
| `CartWrapper`                    | `header.tsx`               | Static bag icon      |
| `SearchContent`                  | `search/page.tsx`          | Full page skeleton   |
| `SearchResults`                  | Inside `SearchContent`     | Skeleton grid        |
| `SearchInput` / `CategoryFilter` | Inside `SearchContent`     | (none — fast)        |


---

## Server vs Client Component Split

The guiding principle: **Server Components by default. `"use client"` only when the browser is required.**

### Server Components (default)

All page layouts, data fetching, and content rendering happen in Server Components:

- `Header`, `Footer`, `Hero`, `PromoBanner`, `ProductContent`, `SearchContent`, `SearchResults`, `FeaturedProducts`, `AddToCartSection`, `StockIndicator`, `ProductCard`, `ProductGridSkeleton`

These components have zero client-side JavaScript overhead.

### Client Components (`"use client"`)

The codebase currently has **11 modules** with `"use client"` (9 shared components + 2 route-level error boundaries):


| Component          | Why it needs the client                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `SearchInput`      | Text input state, `onChange`/`onKeyDown` handlers, debounce timer, `useRouter` for URL navigation                         |
| `CategoryFilter`   | Custom listbox state, keyboard navigation, `useRouter` for URL navigation                                                 |
| `QuantitySelector` | Click handlers for increment/decrement buttons                                                                            |
| `AddToCartButton`  | `useState` for quantity/loading/error state and click handling for `addToCartAction`                                      |
| `CartSheet`        | `useState`/context-driven open state, `useRef` + `useEffect` for dialog lifecycle and focus management                    |
| `CartItem`         | `useTransition` for quantity/remove mutations                                                                             |
| `CartProvider` (`cart-context.tsx`) | Holds cart state in React context, applies `useOptimistic` updates, and controls cart sheet state                       |
| `HeroScrollCue`    | Scroll event listener, `useState` for visibility toggle                                                                   |
| `ErrorDisplay`     | `useEffect` for error logging, `reset` click handler                                                                      |
| `app/error.tsx` and `app/products/[slug]/error.tsx` | Route-level error boundaries are client modules by Next.js convention                                                   |


### Importing Server Actions in Client Components

Client components import Server Actions directly from `lib/cart-actions.ts` (a `"use server"` module). In Next.js 16, this is the standard pattern — the bundler replaces the import with a serializable reference that React can call over the network. No prop-passing through the server tree is needed.

---

## Server Actions

All cart mutations use Server Actions (`"use server"` in `lib/cart-actions.ts`):

- `addToCartAction(productId, quantity)` — Creates a cart if needed (lazy), then adds the item.
- `updateCartItemAction(itemId, quantity)` — Updates an existing item's quantity.
- `removeCartItemAction(itemId)` — Removes an item entirely.
- `getCartAction()` — Reads the current cart (used by both server and client components).

### Why Server Actions over Route Handlers?

- Server Actions are **co-located** with the data logic, reducing indirection.
- They integrate natively with React's `useTransition` for optimistic UI updates.
- They can call `cookies()` and `updateTag()` directly — no need for a separate API route.
- The assignment specifically requires demonstrating Server Actions as a Next.js 16 pattern.

### `updateTag` after mutations

Every cart mutation calls `updateTag(`cart-${token}`)` after success. This invalidates the cached cart data in `fetchCachedCart()` (in the header), which is tagged with the same `cart-{token}` key. On the next request, the header re-fetches the cart and the badge count updates.

---

## Cart Architecture

### Token-based session persistence

The external API uses anonymous cart tokens. Our implementation:

1. **No cart on first visit** — no cookie is set until the user adds their first item.
2. **Lazy creation** — `ensureCart()` checks for an existing token in cookies. If none exists, it calls `POST /cart/create` and stores the returned `x-cart-token` in an `httpOnly` cookie.
3. **Cookie settings** — `httpOnly: true` (not accessible via JS), `sameSite: "lax"`, `maxAge: 2592000` (30 days). The API tokens themselves expire after 24 hours of inactivity; if a token expires, `getCartAction` catches the error and returns `null`, effectively starting a fresh session.
4. **Session persistence** — Refreshing the page or navigating away preserves the cart because the cookie persists across browser sessions.

### Cart display architecture

The header's cart icon path is split into server + client responsibilities:

- `CartWrapper` (server, inside `header.tsx`) reads the cookie and fetches the cart via `fetchCachedCart` (`"use cache"` keyed by token).
- `CartInitializer` (client) hydrates that server-fetched cart into `CartProvider` context.
- `CartSheet` and `CartItem` consume context (`useCart`) and perform optimistic updates via `useOptimistic` in `cart-context.tsx`.
- Cart mutations still return the canonical updated cart from Server Actions, and UI state is reconciled with those responses (with a fallback `getCartAction()` refresh when needed).

### Why `async cookies()`?

In Next.js 16, `cookies()` returns a Promise. All calls in `cart-actions.ts` use `await cookies()`. This is a breaking change from earlier versions where `cookies()` was synchronous.

---

## Search Architecture

### URL-driven state

All search state lives in the URL as query parameters (`?q=...&category=...`). This was chosen over component state because:

- **Shareable URLs** — Copy/paste the URL and the same results appear.
- **Browser history** — Back/forward navigation works naturally.
- **Refresh persistence** — Refreshing the page restores the exact same search.
- **Server-side rendering** — The server reads `searchParams` and fetches matching products.

### Client-side input behavior

`SearchInput` triggers a search in three ways (per the assignment requirements):

1. **Enter key** — Immediate navigation.
2. **Search button** — Immediate navigation.
3. **Auto-trigger after 3+ characters** — Debounced at 400ms to avoid excessive requests.

The component uses `useRouter().replace()` (not `push`) to avoid polluting browser history with every keystroke.

### Result limits by state

`SearchResults` applies different limits depending on whether the user is actively searching:

- **Default browse state** (`q` and `category` empty): fetches **9 products**.
- **Active search/filter state** (query and/or category present): fetches **up to 5 products**.

This matches the assignment intent: show a useful default product set before searching, then cap matched results at five once a search is performed.

### Suspense key for fresh results

The search results `<Suspense>` boundary uses a `key` prop derived from the current query and category:

```tsx
<Suspense key={`${q ?? ""}-${category ?? ""}`} fallback={<ResultsSkeleton />}>
```

This forces React to unmount and remount the `SearchResults` component when the search parameters change, showing the skeleton again while new results load. Without the key, React would keep showing stale results until the new ones resolve.

---

## Metadata Strategy

### Root layout metadata

The root layout defines default metadata with a **title template**:

```ts
title: {
  default: "Vercel Swag Store",
  template: "%s | Vercel Swag Store",
}
```

This means child pages can export just `title: "Search Products"` and it renders as "Search Products | Vercel Swag Store".

### Page-specific metadata

- **Homepage** — Static `metadata` export with custom title and OG tags.
- **Search page** — Static `metadata` export.
- **Product detail page** — Dynamic `generateMetadata` that fetches the product and uses its name, description, and image for OG tags.

### Required meta tags

The API specification requires two specific meta tags:

```html
<meta name="generator" content="vswag-cert-v3" />
<meta name="theme-color" content="#171719" />
```

These are placed directly in the root layout's `<head>` to ensure they appear on every page.

---

## Styling Approach

### Tailwind CSS v4 (CSS-first config)

Tailwind v4 uses a CSS-first configuration model. There is no `tailwind.config.ts`. Instead, theming is done in `globals.css` using `@theme inline`:

```css
@theme inline {
  --color-background: var(--background);
  --color-muted: var(--muted);
  /* ... */
}
```

### Design tokens

All colors are defined as CSS custom properties in `:root` and referenced via `var(--...)` throughout:


| Token                | Value     | Usage                                   |
| -------------------- | --------- | --------------------------------------- |
| `--background`       | `#171719` | Page background                         |
| `--foreground`       | `#ededed` | Primary text                            |
| `--muted`            | `#2a2a2d` | Card backgrounds, secondary surfaces    |
| `--muted-foreground` | `#888892` | Secondary text, placeholders            |
| `--border`           | `#2e2e32` | Borders, dividers, skeleton backgrounds |


This gives a dark, Vercel-inspired aesthetic while keeping the color system maintainable.

### Responsive design

All layouts use Tailwind's responsive prefixes (`sm:`, `lg:`) for a mobile-first approach:

- Product grids: 1 column on mobile, 2 on tablet (`sm:`), 3 on desktop (`lg:`)
- PDP layout: stacked on mobile, 2-column side-by-side on desktop (`lg:`)
- Search controls: stacked on mobile, inline on tablet (`sm:`)

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        External API                                 │
│         https://vercel-swag-store-api.vercel.app/api               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    lib/api.ts (typed fetch client)
                             │
              ┌──────────────┼──────────────────────┐
              │              │                      │
        "use cache"     No cache (dynamic)    "use server"
              │              │                      │
     ┌────────┴───────┐   ┌─┴──────────────┐   ┌──┴────────────┐
     │ FeaturedProducts│   │ AddToCartSection│   │ addToCartAction│
     │ fetchProduct()  │   │  (stock fetch) │   │ updateCartItem │
     │ fetchCategories │   └────────────────┘   │ removeCartItem │
     │ fetchPromotion  │                        │ getCartAction  │
     │ fetchSearch     │                        └──┬────────────┘
     │ fetchCachedCart │                           │
     │ Footer          │                           ▼
     └────────┬───────┘                      Called from
              │                              client components
              ▼                              via useTransition
        Streams via Suspense;
        cache keys include function
        args (slug, query, token)
        for per-variant caching
```

