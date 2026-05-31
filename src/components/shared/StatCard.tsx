import { type ReactNode } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}

/** Compact metric card for the dashboard overview. Responsive by container. */
export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-body-sm font-medium text-foreground-muted">
          {label}
        </p>
        {icon && (
          <span className="text-foreground-muted" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-h1 tabular-nums">{value}</p>
      {hint && (
        <p className="mt-1 text-caption text-foreground-muted">{hint}</p>
      )}
    </Card>
  );
}
