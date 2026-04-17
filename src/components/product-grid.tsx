import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
  eagerImageCount?: number;
}

export function ProductGrid({ products, eagerImageCount = 3 }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          imageLoading={index < eagerImageCount ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
