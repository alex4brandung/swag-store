import { searchProducts } from "@/lib/api";
import { getSearchPageProductLimit } from "./utils/search-list-limit";

interface SearchResultsCountProps {
  query?: string;
  category?: string;
}

export async function SearchResultsCount({
  query,
  category,
}: SearchResultsCountProps) {
  const { products, pagination } = await searchProducts({
    search: query || undefined,
    category: category || undefined,
    limit: getSearchPageProductLimit(Boolean(query)),
  });
  const total = pagination?.total ?? products.length;

  return (
    <span className="text-sm font-normal text-muted-foreground">
      {" "}
      — {total} result{total !== 1 ? "s" : ""}
    </span>
  );
}
