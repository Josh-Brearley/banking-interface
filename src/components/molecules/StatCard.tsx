import { type ReactNode } from "react";
import { Card } from "@/components/atoms";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Icon rendered in a rounded chip in the card's top corner. */
  icon?: ReactNode;
  /** Tailwind classes for the icon chip (e.g. tone). */
  iconClassName?: string;
  /** Optional trailing element in the header row (e.g. a trend pill). */
  trailing?: ReactNode;
  /** Decorative corner graphic (rendered behind content). */
  graphic?: ReactNode;
  hint?: string;
  className?: string;
}

/** Compact metric card for the dashboard overview. Responsive by container. */
export function StatCard({
  label,
  value,
  icon,
  iconClassName,
  trailing,
  graphic,
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      {graphic}
      {(icon || trailing) && (
        <div className="relative flex items-start justify-between gap-3">
          {icon && (
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-foreground-muted",
                iconClassName,
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          {trailing}
        </div>
      )}
      <p
        className={cn(
          "relative text-body-sm font-medium text-foreground-muted",
          (icon || trailing) && "mt-3",
        )}
      >
        {label}
      </p>
      <p className="relative mt-1 text-h1 tabular-nums">{value}</p>
      {hint && (
        <p className="relative mt-1 text-caption text-foreground-muted">
          {hint}
        </p>
      )}
    </Card>
  );
}
