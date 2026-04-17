import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";

type FeaturedProductsProps = {
  limit?: number;
};

export async function FeaturedProducts({ limit = 6 }: FeaturedProductsProps) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("products:featured:true");

  const products = await getProducts({ featured: true, limit });

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No featured products available.
      </p>
    );
  }

  return <ProductGrid products={products} />;
}
