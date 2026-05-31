import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Skeleton placeholder — specs/02-design-system.md §3.10 (DS-FR-19). */
export function Skeleton({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "skeleton-shimmer relative overflow-hidden rounded-md bg-surface-muted",
        className,
      )}
      {...rest}
    />
  );
}

/** Wrap loading regions so screen readers announce a busy state. */
export function SkeletonRegion({
  className,
  label = "Loading",
  children,
}: {
  className?: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}
