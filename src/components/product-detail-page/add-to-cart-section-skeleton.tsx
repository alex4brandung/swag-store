export function AddToCartSectionSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-muted-foreground/35" />
        <div className="h-4 w-48 max-w-full animate-pulse rounded-sm bg-muted-foreground/20" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 shrink-0 animate-pulse rounded-sm bg-muted-foreground/20" />
          <div className="flex h-10 w-fit overflow-hidden rounded-lg border border-border/50">
            <div className="w-10 animate-pulse bg-muted-foreground/15" />
            <div className="w-12 border-x border-border/50 animate-pulse bg-muted-foreground/25" />
            <div className="w-10 animate-pulse bg-muted-foreground/15" />
          </div>
        </div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-muted-foreground/20 sm:w-44" />
      </div>
    </div>
  );
}
