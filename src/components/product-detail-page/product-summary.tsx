import { formatPrice } from "@/lib/utils";

interface ProductSummaryProps {
  category: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export function ProductSummary({
  category,
  name,
  description,
  price,
  currency,
}: ProductSummaryProps) {
  return (
    <>
      <div>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {category}
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {name}
        </h1>
        <p className="mt-3 text-2xl font-semibold text-foreground">
          {formatPrice(price, currency)}
        </p>
      </div>

      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
        {description}
      </p>
    </>
  );
}
