export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-border rounded w-40 mb-6" />
        <div className="flex gap-3">
          <div className="flex-1 h-11 bg-muted border border-border rounded-lg" />
          <div className="w-36 h-11 bg-muted border border-border rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-muted overflow-hidden"
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
    </div>
  );
}
