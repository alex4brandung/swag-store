import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 mb-8">
          <VercelTriangle size={10} />
          <span className="text-xs text-[var(--muted-foreground)] font-medium">
            Official Vercel Merchandise
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Gear Up,
          <br />
          <span className="text-[var(--muted-foreground)]">Ship Faster.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
          Premium developer apparel and accessories from the team that brings
          you Next.js and the best deployment platform on the web.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-[#171719] font-semibold px-6 py-3 text-sm hover:bg-gray-100 transition-colors"
          >
            Shop All Products
            <ArrowRightIcon />
          </Link>
          <Link
            href="/search?category=t-shirts"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] font-medium px-6 py-3 text-sm hover:border-[#555] hover:bg-[var(--muted)] transition-colors"
          >
            Browse Apparel
          </Link>
        </div>
      </div>
    </section>
  );
}

function VercelTriangle({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 65"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
