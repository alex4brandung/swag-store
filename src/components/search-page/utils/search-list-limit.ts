/** Assignment: up to 5 products when a text search is active; category-only / default browse uses the larger grid. */
export function getSearchPageProductLimit(hasTextQuery: boolean): number {
  return hasTextQuery ? 5 : 9;
}
