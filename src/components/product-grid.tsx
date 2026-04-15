import { listProducts } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";
import { ProductCard } from "./product-card";

interface FeaturedProductsProps {
  limit?: number;
}

export async function FeaturedProducts({ limit = 6 }: FeaturedProductsProps) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("products:featured:true");

  const products = await listProducts({ featured: true, limit });

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No featured products available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
