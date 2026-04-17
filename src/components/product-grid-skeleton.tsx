import { Card, CardContent } from "@/components/ui/card";

type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="gap-0 overflow-hidden bg-muted py-0 animate-pulse"
        >
          <div className="aspect-square bg-border" />
          <CardContent className="space-y-2 p-4">
            <div className="h-3 bg-border rounded w-16" />
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-16 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
