import type { StockInfo } from "@/lib/types";

type StockIndicatorProps = {
  stock: StockInfo;
};

export function StockIndicator({ stock }: StockIndicatorProps) {
  if (!stock.inStock) {
    return (
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-danger" />
        <span className="text-sm text-danger-foreground font-medium">
          Out of stock
        </span>
      </div>
    );
  }

  if (stock.lowStock) {
    return (
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-warning animate-pulse"
        />
        <span className="text-sm text-warning-foreground font-medium">
          Low stock — only {stock.stock} left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
      <span className="text-sm text-success-foreground font-medium">
        In stock ({stock.stock} available)
      </span>
    </div>
  );
}
