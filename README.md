# Vercel Swag Store

A Next.js 16 storefront demo for the Vercel Partner Certification assignment.

The app implements:

- Homepage with hero, promo banner, and featured products
- Search page with URL-driven filters (`q`, `category`)
- Product detail pages with stock state and add-to-cart
- Session-based cart with add, update, remove, and persisted token cookie
- Cache Components (`"use cache"`), Suspense boundaries, and Server Actions

## Tech Stack

- Next.js `16.2.4` (App Router)
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`

## Prerequisites

- Node.js `>= 20` (Node `24 LTS` recommended)
- `pnpm` (lockfile is included as `pnpm-lock.yaml`)

## Environment Variables

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `SWAG_API_BASE_URL` | Yes | Base URL of the Swag Store API |
| `SWAG_API_BYPASS_TOKEN` | Yes | Token sent as `x-vercel-protection-bypass` header |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for metadata/OG |
| `SWAG_DEBUG_TIMINGS` | No | Set to `1` to log API request timings on the server |

If required env vars are missing, the app throws at runtime and logs a helpful warning from `src/lib/api.ts`.

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` - start development server
- `pnpm build` - create production build
- `pnpm start` - run production build
- `pnpm lint` - run ESLint

## Routes

- `/` - landing page with promo + featured products
- `/search` - search and category-filtered browse
- `/products/[slug]` - product detail page

## Architecture Notes

For deeper implementation details, see:

- `docs/ARCHITECTURE.md` - full architecture and decision rationale
- `docs/USE_CACHE.md` - complete map of `"use cache"` usage and invalidation
- `docs/assignment/assignment.md` - original assignment brief

## Deployment

This project is intended for deployment on Vercel.

Before deploying, make sure the required environment variables are set in your Vercel project settings.
