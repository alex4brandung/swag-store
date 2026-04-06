"use client";

interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0 rounded-lg border border-[var(--border)] overflow-hidden w-fit">
      <button
        type="button"
        onClick={() => value > 1 && onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        −
      </button>
      <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-[var(--foreground)] border-x border-[var(--border)]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => value < max && onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
