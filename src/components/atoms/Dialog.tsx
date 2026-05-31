import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";

export interface DialogBaseProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  position?: "center" | "right";
  size?: "sm" | "md" | "lg";
  closeOnOverlay?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<DialogBaseProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

/**
 * Shared focus-trapped dialog shell, DS-FR-15/16 / NFR-A11Y-08.
 * The panel only mounts while open so focus management activates/cleans up
 * with the dialog. Modal (centered) and Drawer (side) wrap this.
 */
export function DialogBase({ open, ...rest }: DialogBaseProps) {
  if (!open) return null;
  return createPortal(<DialogPanel {...rest} />, document.body);
}

type DialogPanelProps = Omit<DialogBaseProps, "open">;

function DialogPanel({
  onClose,
  title,
  description,
  children,
  position = "center",
  size = "md",
  closeOnOverlay = true,
  className,
}: DialogPanelProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(onClose);
  const titleId = useId();
  const descId = useId();

  // Lock background scroll while open (NFR-A11Y-08).
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const isDrawer = position === "right";

  return (
    <div
      className={cn(
        "fixed inset-0 z-modal flex",
        isDrawer ? "justify-end" : "items-center justify-center p-4",
      )}
    >
      <div
        data-testid="dialog-overlay"
        aria-hidden="true"
        onClick={closeOnOverlay ? onClose : undefined}
        className="absolute inset-0 bg-foreground/40 motion-safe:animate-fade-in"
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-modal flex max-h-[90vh] flex-col bg-surface shadow-lg focus:outline-none",
          isDrawer
            ? "h-full w-full max-w-md rounded-l-lg motion-safe:animate-drawer-in"
            : cn(
                "w-full rounded-lg motion-safe:animate-dialog-in",
                sizeClasses[size],
              ),
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
            {description && (
              <p
                id={descId}
                className="mt-1 text-body-sm text-foreground-muted"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
