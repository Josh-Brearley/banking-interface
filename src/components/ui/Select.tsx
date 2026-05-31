import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "id"
> {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
  placeholder?: string;
  id?: string;
}

/** Native styled Select — specs/02-design-system.md §3.3 (DS-FR-12). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      hint,
      error,
      placeholder,
      id,
      className,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy =
      [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-body-sm font-medium">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          className={cn(
            "h-10 w-full rounded-md border bg-surface px-3 text-body transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger" : "border-border",
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hint && !error && (
          <p id={hintId} className="text-caption text-foreground-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-caption text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
