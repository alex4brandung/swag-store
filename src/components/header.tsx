import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--foreground)] hover:text-white transition-colors"
        >
          <VercelTriangle />
          <span className="text-sm font-semibold tracking-tight">
            Swag Store
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Search
          </Link>
          {/* Cart icon will be added later */}
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
