type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-muted overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-border" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-border rounded w-16" />
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-16 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
