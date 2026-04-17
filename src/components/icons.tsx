import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Delete02Icon,
  Loading03Icon,
  Moon02Icon,
  Search01Icon,
  ShoppingBag02Icon,
  Sun01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type IconProps = {
  size?: number;
  className?: string;
};

export function VercelTriangle({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 65"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Cancel01Icon}
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    />
  );
}

type ChevronDownIconProps = IconProps & {
  strokeWidth?: number;
};

export function ChevronDownIcon({
  size = 16,
  className,
  strokeWidth = 2,
}: ChevronDownIconProps) {
  return (
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={className}
    />
  );
}

export function SearchEmptyIcon({ className }: Pick<IconProps, "className">) {
  return (
    <HugeiconsIcon
      icon={Search01Icon}
      size={24}
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    />
  );
}

export function SpinnerIcon({ className }: Pick<IconProps, "className">) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      size={14}
      strokeWidth={2}
      className={["animate-spin", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

export function CheckIcon({ size = 14, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Tick02Icon}
      size={size}
      strokeWidth={2.5}
      aria-hidden="true"
      className={className}
    />
  );
}

export function ShoppingBagIcon({ size = 20, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={ShoppingBag02Icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      className={className}
    />
  );
}

export function ArrowRightIcon({ size = 14, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    />
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Search01Icon}
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    />
  );
}

export function SunIcon({ size = 18, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Sun01Icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      className={className}
    />
  );
}

export function MoonIcon({ size = 18, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Moon02Icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      className={className}
    />
  );
}

export function TrashIcon({ size = 14, className }: IconProps) {
  return (
    <HugeiconsIcon
      icon={Delete02Icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      className={className}
    />
  );
}
