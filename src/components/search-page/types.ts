export interface SearchParams {
  q?: string;
  category?: string;
}

export interface SearchSectionProps {
  searchParams: Promise<SearchParams>;
}
