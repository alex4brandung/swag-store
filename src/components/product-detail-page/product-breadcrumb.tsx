import Link from "next/link";

type ProductBreadcrumbProps = {
  category: string;
  productName: string;
};

export function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href={`/search?category=${encodeURIComponent(category)}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {category}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-foreground truncate max-w-[200px]">{productName}</li>
      </ol>
    </nav>
  );
}
