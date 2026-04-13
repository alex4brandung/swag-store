export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="flex gap-2 mb-8">
        <div className="h-4 bg-border rounded w-10" />
        <div className="h-4 bg-border rounded w-2" />
        <div className="h-4 bg-border rounded w-16" />
        <div className="h-4 bg-border rounded w-2" />
        <div className="h-4 bg-border rounded w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-square rounded-2xl bg-muted border border-border" />
        <div className="flex flex-col gap-6">
          <div>
            <div className="h-3 bg-border rounded w-16 mb-3" />
            <div className="h-8 bg-border rounded w-3/4 mb-3" />
            <div className="h-7 bg-border rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded w-full" />
            <div className="h-4 bg-border rounded w-5/6" />
            <div className="h-4 bg-border rounded w-4/6" />
          </div>
          <div className="h-4 bg-border rounded w-28" />
          <div className="h-12 bg-border rounded w-36" />
        </div>
      </div>
    </div>
  );
}
