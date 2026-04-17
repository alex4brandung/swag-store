"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
};

type CategoryOption = {
  value: string;
  label: string;
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();

  const options: CategoryOption[] = [
    { value: "", label: "All categories" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: `${cat.name} (${cat.productCount})`,
    })),
  ];

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === selectedCategory),
  );
  const selectedLabel = options[selectedIndex]?.label ?? "All categories";

  const applyValue = useCallback(
    (value: string) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      setSelectedCategory(value);
      const nextQuery = params.toString();
      router.replace(nextQuery ? `/search?${nextQuery}` : "/search");
      setOpen(false);
      triggerRef.current?.focus();
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

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = optionRefs.current[selectedIndex] ?? optionRefs.current[0];
    el?.focus();
  }, [open, selectedIndex]);

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    value: string,
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      applyValue(value);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = optionRefs.current[index + 1];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        triggerRef.current?.focus();
        setOpen(false);
      } else {
        optionRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      optionRefs.current[options.length - 1]?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 sm:w-auto sm:min-w-48"
    >
      <Button
        ref={triggerRef}
        variant="muted"
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full min-w-0 justify-between gap-2 py-2.5 pl-3 pr-2.5 text-left text-base sm:text-sm"
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <span
          className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <ChevronDownIcon size={12} strokeWidth={2.5} />
        </span>
      </Button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
          className="absolute left-0 top-full z-50 mt-1 w-full max-h-[min(70vh,22rem)] overflow-y-auto rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === selectedCategory;
            return (
              <Button
                key={opt.value === "" ? "__all__" : opt.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                variant="ghost"
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => applyValue(opt.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, index, opt.value)}
                className={`flex w-full items-center gap-2 px-3 py-3 text-left text-base leading-snug sm:py-2.5 sm:text-sm ${
                  isSelected
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                {isSelected ? (
                  <span
                    className="inline-flex w-4 shrink-0 justify-center text-foreground"
                    aria-hidden="true"
                  >
                    <CheckIcon />
                  </span>
                ) : (
                  <span
                    className="inline-block w-4 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0 flex-1">{opt.label}</span>
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
