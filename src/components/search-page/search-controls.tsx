import { cacheLife, cacheTag } from "next/cache";
import { listCategories } from "@/lib/api";
import { CategoryFilter } from "@/components/category-filter";
import { SearchInput } from "@/components/search-input";

async function fetchCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return listCategories();
}

export async function SearchControls() {
  const categories = await fetchCategories();

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
