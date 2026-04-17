import Image from "next/image";
import Link from "next/link";
import { VercelTriangle } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  imageLoading?: "eager" | "lazy";
};

export function ProductCard({ product, imageLoading = "lazy" }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Card className="h-full gap-0 overflow-hidden bg-muted py-0 transition-colors group-hover:ring-foreground/30">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              loading={imageLoading}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <VercelTriangle size={40} className="text-border" />
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="mt-auto pt-2 text-sm font-semibold text-foreground">
            {formatPrice(product.price, product.currency)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
