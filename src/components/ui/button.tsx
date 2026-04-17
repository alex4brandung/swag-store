import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariantClasses = {
  default:
    "bg-accent text-accent-foreground font-semibold hover:bg-accent/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  muted: "border border-border bg-muted text-foreground hover:bg-muted/80",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
} as const;

const buttonSizeClasses = {
  default: "px-4 py-2.5",
  sm: "px-3 py-2",
  icon: "h-8 w-8 p-0",
  iconSm: "h-6 w-6 p-0",
  iconLg: "h-10 w-10 p-0",
} as const;

type ButtonVariant = keyof typeof buttonVariantClasses;
type ButtonSize = keyof typeof buttonSizeClasses;

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          buttonVariantClasses[variant],
          buttonSizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
