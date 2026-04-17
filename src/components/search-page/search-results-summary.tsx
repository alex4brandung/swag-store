export type SearchResultsSummaryProps = {
  total: number;
  query: string;
  category: string;
};

export function SearchResultsSummary({
  total,
  query,
  category,
}: SearchResultsSummaryProps) {
  const hasFilter = Boolean(query || category);
  const scopeParts = [
    query ? `for "${query}"` : null,
    category ? `in ${category}` : null,
  ].filter(Boolean);

  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium tabular-nums text-foreground">{total}</span>{" "}
      {!hasFilter ? (
        <span>product{total !== 1 ? "s" : ""}</span>
      ) : (
        <span>
          result{total !== 1 ? "s" : ""}
          {scopeParts.length > 0 ? <> {scopeParts.join(" · ")}</> : null}
        </span>
      )}
    </p>
  );
}
