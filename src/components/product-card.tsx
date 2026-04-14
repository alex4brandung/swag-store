import Image from "next/image";
import Link from "next/link";
import { VercelTriangle } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-muted hover:border-[#444448] transition-colors"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <VercelTriangle size={40} className="text-border" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-sm font-medium text-foreground group-hover:text-white transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-sm font-semibold text-foreground">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
