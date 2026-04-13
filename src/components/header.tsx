import Link from "next/link";
import { Suspense } from "react";
import { getCartAction } from "@/lib/cart-actions";
import { CartSheet } from "./cart/cart-sheet";

async function CartWrapper() {
  const cart = await getCartAction();
  return <CartSheet initialCart={cart} />;
}

function CartFallback() {
  return (
    <div className="relative flex items-center text-white/80">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground hover:text-white transition-colors"
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
          <Suspense fallback={<CartFallback />}>
            <CartWrapper />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

function VercelTriangle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 76 65"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}
