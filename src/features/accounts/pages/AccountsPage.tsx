import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import {
  EmptyState,
  Input,
  type Column,
  type SortState,
} from "@/components/ui";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { maskAccountNumber } from "@/lib/utils";
import type { Account } from "@/types";
import type { AccountQuery } from "@/services/accounts.service";
import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "../components/AccountCard";
import {
  AccountStatusBadge,
  AccountTypeBadge,
} from "../components/AccountBadges";

const columns: Column<Account>[] = [
  { id: "name", header: "Name", sortable: true, cell: (a) => a.name },
  {
    id: "number",
    header: "Number",
    cell: (a) => (
      <span className="font-mono">{maskAccountNumber(a.accountNumber)}</span>
    ),
  },
  {
    id: "type",
    header: "Type",
    sortable: true,
    cell: (a) => <AccountTypeBadge type={a.type} />,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    cell: (a) => <AccountStatusBadge status={a.status} />,
  },
  {
    id: "balance",
    header: "Balance",
    sortable: true,
    align: "right",
    cell: (a) => <MoneyAmount amountMinor={a.balanceMinor} />,
  },
];

export function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const sortId = searchParams.get("sort") ?? undefined;
  const dir = (searchParams.get("dir") as "asc" | "desc" | null) ?? undefined;

  const [term, setTerm] = useState(q);
  const debounced = useDebouncedValue(term, 200);

  // Reflect the debounced search term in the URL (shareable, back/forward).
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debounced) next.set("q", debounced);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [debounced, setSearchParams]);

  const query = useMemo<AccountQuery>(
    () => ({
      search: q || undefined,
      sort: (sortId as AccountQuery["sort"]) ?? undefined,
      dir,
    }),
    [q, sortId, dir],
  );

  const { data, isLoading, isError, refetch } = useAccounts(query);

  const sort: SortState | undefined = sortId
    ? { columnId: sortId, direction: dir ?? "asc" }
    : undefined;

  const handleSortChange = (next: SortState) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set("sort", next.columnId);
        p.set("dir", next.direction);
        return p;
      },
      { replace: true },
    );
  };

  const emptyState = q ? (
    <EmptyState
      title="No matching accounts"
      description={`No accounts match “${q}”.`}
      action={{ label: "Clear search", onClick: () => setTerm("") }}
    />
  ) : (
    <EmptyState
      title="No accounts yet"
      description="When you open an account it will appear here."
    />
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Accounts"
        subtitle="All your Eagle Bank products in one place."
      />

      <div className="mb-4 max-w-sm">
        <Input
          label="Search accounts"
          type="search"
          placeholder="Search by name or number"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <DataTable
        caption="Your accounts"
        columns={columns}
        data={data ?? []}
        getRowId={(a) => a.id}
        renderCard={(a) => <AccountCard account={a} />}
        sort={sort}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyState={emptyState}
      />
    </div>
  );
}
