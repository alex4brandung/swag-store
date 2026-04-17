import { SearchEmptyIcon } from "@/components/icons";

export interface SearchResultsEmptyProps {
  query: string;
}

export function SearchResultsEmpty({ query }: SearchResultsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
        <SearchEmptyIcon className="text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">No products found</p>
        <p className="text-sm text-muted-foreground mt-1">
          {query
            ? `No results for "${query}". Try a different search term.`
            : "No products match the selected filters."}
        </p>
      </div>
    </div>
  );
}
