export function SearchControlsSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="h-[42px] flex-1 rounded-lg border border-border bg-muted animate-pulse"
          aria-hidden
        />
        <div
          className="h-[42px] w-full min-w-0 rounded-lg border border-border bg-muted animate-pulse sm:w-auto sm:min-w-48 sm:shrink-0"
          aria-hidden
        />
      </div>
    </div>
  );
}
