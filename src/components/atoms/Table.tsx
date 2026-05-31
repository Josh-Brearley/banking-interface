import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

export type SortDirection = "asc" | "desc";
export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
}

export interface TableProps<T> {
  /** Accessible table caption (visually hidden by default). */
  caption: string;
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  className?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

/** Semantic, sortable, accessible table, specs/02-design-system.md §3.5 (DS-FR-14). */
export function Table<T>({
  caption,
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  isLoading = false,
  emptyState,
  className,
}: TableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSortChange) return;
    const isActive = sort?.columnId === column.id;
    const direction: SortDirection =
      isActive && sort?.direction === "asc" ? "desc" : "asc";
    onSortChange({ columnId: column.id, direction });
  };

  const ariaSort = (column: Column<T>) => {
    if (!column.sortable) return undefined;
    if (sort?.columnId !== column.id) return "none" as const;
    return sort.direction === "asc"
      ? ("ascending" as const)
      : ("descending" as const);
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-body-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={ariaSort(column)}
                className={cn(
                  "px-4 py-3 font-medium text-foreground-muted",
                  alignClass[column.align ?? "left"],
                )}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className="inline-flex items-center gap-1 rounded font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {column.header}
                    <SortIcon state={ariaSort(column)} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4">
                <div role="status" aria-busy="true" aria-label="Loading">
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                  <span className="sr-only">Loading</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6">
                {emptyState ?? (
                  <p className="text-center text-foreground-muted">
                    No results found
                  </p>
                )}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-b border-border last:border-0 hover:bg-surface-muted/50"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 py-3 text-foreground",
                      alignClass[column.align ?? "left"],
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({
  state,
}: {
  state: "ascending" | "descending" | "none" | undefined;
}) {
  return (
    <span aria-hidden="true" className="text-foreground-muted">
      {state === "ascending" ? "▲" : state === "descending" ? "▼" : "↕"}
    </span>
  );
}
