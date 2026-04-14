import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold text-border">404</span>
        <h1 className="text-xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-accent text-accent-foreground font-semibold px-5 py-2.5 text-sm hover:bg-accent/90 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/search"
          className="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 text-sm hover:bg-muted transition-colors"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
