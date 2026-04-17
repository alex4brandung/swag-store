"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const [value, setValue] = useState(qParam);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(qParam);
  }, [qParam]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigate(query: string) {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    const nextQuery = params.toString();
    router.replace(nextQuery ? `/search?${nextQuery}` : "/search");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (next.length >= 3 || next.length === 0) {
      debounceRef.current = setTimeout(() => navigate(next), 400);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      navigate(value);
    }
  }

  function handleSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(value);
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue("");
    navigate("");
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full rounded-lg border border-border bg-muted pl-10 pr-10 py-2.5 text-base md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
        />
        {value && (
          <Button
            variant="ghost"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 h-auto w-auto -translate-y-1/2 rounded-md bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <CloseIcon size={14} />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        className="px-4 py-2.5 text-base font-medium md:text-sm"
      >
        Search
      </Button>
    </div>
  );
}
