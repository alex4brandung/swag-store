"use client";

import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function QuantitySelector({
  value,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden w-fit">
      <Button
        variant="ghost"
        size="iconLg"
        onClick={() => value > 1 && onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className="rounded-none text-foreground hover:bg-muted disabled:opacity-40"
      >
        −
      </Button>
      <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-foreground border-x border-border">
        {value}
      </span>
      <Button
        variant="ghost"
        size="iconLg"
        onClick={() => value < max && onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="rounded-none text-foreground hover:bg-muted disabled:opacity-40"
      >
        +
      </Button>
    </div>
  );
}
