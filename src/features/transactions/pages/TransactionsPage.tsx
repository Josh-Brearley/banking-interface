import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { Pagination } from "@/components/shared/Pagination";
import { TransactionTypeBadge } from "@/components/shared/TransactionTypeBadge";
import {
  Button,
  EmptyState,
  type Column,
  type SortState,
} from "@/components/ui";
import { formatDate, signedMinor } from "@/lib/utils";
import type { Transaction } from "@/types";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionsParams } from "../hooks/useTransactionsParams";
import { TransactionFilters } from "../components/TransactionFilters";
import { TransactionCard } from "../components/TransactionCard";
import { TransactionDetailDrawer } from "../components/TransactionDetailDrawer";

function createColumns(
  onView: (t: Transaction) => void,
): Column<Transaction>[] {
  return [
    {
      id: "date",
      header: "Date",
      sortable: true,
      cell: (t) => formatDate(t.createdAt),
    },
    {
      id: "description",
      header: "Description",
      cell: (t) => <span className="font-medium">{t.description}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (t) => <TransactionTypeBadge type={t.type} />,
    },
    {
      id: "amount",
      header: "Amount",
      sortable: true,
      align: "right",
      cell: (t) => (
        <MoneyAmount
          amountMinor={signedMinor(t.amountMinor, t.direction)}
          signed
          colorBySign
          className="font-semibold"
        />
      ),
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (t) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`View transaction: ${t.description}`}
          onClick={() => onView(t)}
        >
          View
        </Button>
      ),
    },
  ];
}

export function TransactionsPage() {
  const params = useTransactionsParams();
  const { query, sort, dir, page, hasFilters, update, clearFilters } = params;
  const { data, isLoading, isError, refetch } = useTransactions(query);

  const [selected, setSelected] = useState<Transaction | null>(null);

  const onSearch = useCallback(
    (value: string) => update({ q: value || undefined }, { resetPage: true }),
    [update],
  );
  const columns = useMemo(() => createColumns(setSelected), []);

  const sortState: SortState = { columnId: sort, direction: dir };

  const filteredEmpty = (
    <EmptyState
      title="No transactions match your filters"
      description="Try adjusting or clearing your filters above."
    />
  );
  const noneEmpty = (
    <EmptyState
      title="No transactions yet"
      description="Your transactions will appear here once you start banking."
    />
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Transactions"
        subtitle="Search and review your activity."
      />

      <TransactionFilters
        q={params.q}
        type={params.type}
        from={params.from}
        to={params.to}
        hasFilters={hasFilters}
        onSearch={onSearch}
        onType={(value) => update({ type: value }, { resetPage: true })}
        onFrom={(value) => update({ from: value }, { resetPage: true })}
        onTo={(value) => update({ to: value }, { resetPage: true })}
        onClear={clearFilters}
      />

      <DataTable
        caption="Your transactions"
        columns={columns}
        data={data?.items ?? []}
        getRowId={(t) => t.id}
        renderCard={(t) => (
          <TransactionCard transaction={t} onView={setSelected} />
        )}
        sort={sortState}
        onSortChange={(next: SortState) =>
          update({ sort: next.columnId, dir: next.direction })
        }
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyState={hasFilters ? filteredEmpty : noneEmpty}
      />

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={(p) => update({ page: p === 1 ? undefined : p })}
        />
      )}

      <TransactionDetailDrawer
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
