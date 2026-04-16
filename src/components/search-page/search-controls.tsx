import { getCategories } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";
import { CategoryFilter } from "./category-filter";
import { SearchInput } from "./search-input";

export async function SearchControls() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  const categories = await getCategories();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput />
        </div>
        <CategoryFilter categories={categories} />
      </div>
    </div>
  );
}
