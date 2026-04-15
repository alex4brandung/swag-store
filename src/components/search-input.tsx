"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "./icons";

export function SearchInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function syncFromLocation() {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setValue(params.get("q") ?? "");
  }

  useEffect(() => {
    syncFromLocation();
    function handlePopState() {
      syncFromLocation();
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function navigate(query: string) {
    if (typeof window === "undefined") return;
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
          className="w-full rounded-lg border border-border bg-muted pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#555] transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-accent text-accent-foreground font-medium px-4 py-2.5 text-sm hover:bg-accent/90 transition-colors whitespace-nowrap cursor-pointer"
      >
        Search
      </button>
    </div>
  );
}
