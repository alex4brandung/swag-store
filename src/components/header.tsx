import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { cacheTag } from "next/cache";
import { getCart } from "@/lib/api";
import { CartSheet } from "./cart/cart-sheet";
import { CartInitializer } from "./cart/cart-context";
import { ShoppingBagIcon, VercelTriangle } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import type { CartWithProducts } from "@/lib/types";

async function fetchCachedCart(
  token: string | null
): Promise<CartWithProducts | null> {
  "use cache";
  cacheTag(token ? `cart-${token}` : "cart");
  if (!token) return null;
  try {
    return await getCart(token);
  } catch {
    return null;
  }
}

async function CartWrapper() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cart-token")?.value ?? null;
  const cart = await fetchCachedCart(token);
  return (
    <>
      <CartInitializer initialCart={cart} />
      <CartSheet />
    </>
  );
}

function CartFallback() {
  return (
    <div className="relative flex items-center text-foreground/80">
      <ShoppingBagIcon />
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity"
        >
          <VercelTriangle />
          <span className="text-sm font-semibold tracking-tight">
            Swag Store
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Search
          </Link>
          <ThemeToggle />
          <Suspense fallback={<CartFallback />}>
            <CartWrapper />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

