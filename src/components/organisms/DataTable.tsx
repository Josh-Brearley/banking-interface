import { type ReactNode } from "react";
import {
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRegion,
  Table,
  type Column,
  type SortState,
} from "@/components/atoms";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Mobile representation of a single row. */
  renderCard: (row: T) => ReactNode;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: ReactNode;
  /** Min-width at which the table layout is used. Default: md (768px). */
  breakpoint?: string;
}

/**
 * Responsive data presentation, Table on desktop, cards on mobile (DS §4).
 * Owns loading / error / empty so both layouts stay consistent.
 */
export function DataTable<T>({
  caption,
  columns,
  data,
  getRowId,
  renderCard,
  sort,
  onSortChange,
  isLoading = false,
  isError = false,
  onRetry,
  emptyState,
  breakpoint = "(min-width: 768px)",
}: DataTableProps<T>) {
  const isDesktop = useMediaQuery(breakpoint);

  if (isError) {
    return (
      <Card>
        <ErrorState onRetry={onRetry} />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <SkeletonRegion label="Loading" className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </SkeletonRegion>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        {emptyState ?? (
          <EmptyState
            title="No results"
            description="There's nothing to show here yet."
          />
        )}
      </Card>
    );
  }

  if (isDesktop) {
    return (
      <Card className="overflow-hidden">
        <Table
          caption={caption}
          columns={columns}
          data={data}
          getRowId={getRowId}
          sort={sort}
          onSortChange={onSortChange}
        />
      </Card>
    );
  }

  return (
    <ul className="flex flex-col gap-3" aria-label={caption}>
      {data.map((row) => (
        <li key={getRowId(row)}>{renderCard(row)}</li>
      ))}
    </ul>
  );
}
