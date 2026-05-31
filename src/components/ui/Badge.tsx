import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Badge variants — specs/02-design-system.md §3.9 (DS-FR-18). */
export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-surface-muted text-foreground-muted",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        info: "bg-info-subtle text-info",
      },
      size: {
        sm: "px-2 py-0.5 text-caption",
        md: "px-2.5 py-1 text-body-sm",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

const dotColor: Record<
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>,
  string
> = {
  neutral: "bg-foreground-muted",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Render a leading status dot (decorative — meaning comes from the text). */
  withDot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size,
  withDot = false,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...rest}>
      {withDot && (
        <span
          data-testid="badge-dot"
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColor[variant ?? "neutral"],
          )}
        />
      )}
      {children}
    </span>
  );
}
