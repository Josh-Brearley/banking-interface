import { type ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}

/** EmptyState, specs/02-design-system.md §3.11 (DS-FR-20). */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon && (
        <span className="text-foreground-muted" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="text-h3">{title}</h3>
      <p className="max-w-sm text-body-sm text-foreground-muted">
        {description}
      </p>
      {action && (
        <Button variant="secondary" onClick={action.onClick} className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  );
}
