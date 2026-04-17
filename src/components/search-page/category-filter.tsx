"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
};

type CategoryOption = {
  value: string;
  label: string;
};

const ALL_CATEGORIES_VALUE = "__all_categories__";

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");

  const options: CategoryOption[] = [
    { value: ALL_CATEGORIES_VALUE, label: "All categories" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: `${cat.name} (${cat.productCount})`,
    })),
  ];
  const selectedValue = selectedCategory || ALL_CATEGORIES_VALUE;
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ??
    "All categories";
  const applyValue = useCallback(
    (nextValue: string | null) => {
      if (typeof window === "undefined") return;

      const value =
        !nextValue || nextValue === ALL_CATEGORIES_VALUE ? "" : nextValue;
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      setSelectedCategory(value);
      const nextQuery = params.toString();
      router.replace(nextQuery ? `/search?${nextQuery}` : "/search");
    },
    [router],
  );

  useEffect(() => {
    function syncFromLocation() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      setSelectedCategory(params.get("category") ?? "");
    }
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  return (
    <Select
      value={selectedValue}
      onValueChange={applyValue}
    >
      <SelectTrigger
        className="w-full min-w-0 sm:w-auto sm:min-w-48"
      >
        <SelectValue placeholder="All categories" className="min-w-0 truncate">
          {selectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        sideOffset={4}
        align="start"
        alignItemWithTrigger={false}
        className="max-h-[min(70vh,22rem)]"
      >
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
