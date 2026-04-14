import type { StockInfo } from "@/lib/types";

interface StockIndicatorProps {
  stock: StockInfo;
}

export function StockIndicator({ stock }: StockIndicatorProps) {
  if (!stock.inStock) {
    return (
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm text-red-400 font-medium">Out of stock</span>
      </div>
    );
  }

  if (stock.lowStock) {
    return (
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-sm text-amber-400 font-medium">
          Low stock — only {stock.stock} left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-sm text-green-400 font-medium">
        In stock ({stock.stock} available)
      </span>
    </div>
  );
}
