export async function Footer() {
  "use cache";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <VercelTriangle />
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Vercel Swag Store
          </span>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          &copy; {year} Vercel, Inc. All rights reserved.
        </p>
      </div>
    </footer>
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
      className="text-[var(--foreground)]"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}
