import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "./icons";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  label: string;
  hint?: string;
  error?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  id?: string;
  /** For password fields: render an accessible show/hide toggle. */
  showPasswordToggle?: boolean;
}

/** Input, specs/02-design-system.md §3.2 (DS-FR-11). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftAddon,
      rightAddon,
      id,
      type = "text",
      showPasswordToggle = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy =
      [hintId, errorId].filter(Boolean).join(" ") || undefined;

    const [revealed, setRevealed] = useState(false);
    const isPassword = type === "password";
    const resolvedType =
      isPassword && showPasswordToggle && revealed ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-body-sm font-medium">
          {label}
        </label>

        <div className="relative flex items-center">
          {leftAddon && (
            <span
              className="pointer-events-none absolute left-3 text-foreground-muted"
              aria-hidden="true"
            >
              {leftAddon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "h-10 w-full rounded-md border bg-surface px-3 text-body transition-colors duration-fast placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-danger" : "border-border",
              leftAddon && "pl-9",
              (rightAddon || (isPassword && showPasswordToggle)) && "pr-10",
              className,
            )}
            {...rest}
          />

          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-pressed={revealed}
              aria-label={revealed ? "Hide password" : "Show password"}
              className="absolute right-2 rounded p-1 text-foreground-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {revealed ? (
                <IconEyeOff className="h-4 w-4" />
              ) : (
                <IconEye className="h-4 w-4" />
              )}
            </button>
          )}

          {rightAddon && !showPasswordToggle && (
            <span className="absolute right-3 text-foreground-muted">
              {rightAddon}
            </span>
          )}
        </div>

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
Input.displayName = "Input";
