import Image from "next/image";
import { VercelTriangle } from "@/components/icons";

interface ProductImagePanelProps {
  imageUrl?: string;
  productName: string;
}

export function ProductImagePanel({ imageUrl, productName }: ProductImagePanelProps) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <VercelTriangle size={80} className="text-border" />
        </div>
      )}
    </div>
  );
}
