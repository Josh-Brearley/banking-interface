import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { TransactionQuery } from "@/services/transactions.service";
import type { TransactionType } from "@/types";

const PAGE_SIZE = 10;

type ParamPatch = Record<string, string | number | undefined>;

/**
 * Parses the transactions list state from the URL and exposes typed updaters.
 * Filters are shareable & survive refresh/back-forward (TXN-FR-12).
 */
export function useTransactionsParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const type =
    (searchParams.get("type") as TransactionType | null) ?? undefined;
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const sort = (searchParams.get("sort") as "date" | "amount") || "date";
  const dir = (searchParams.get("dir") as "asc" | "desc") || "desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const update = useCallback(
    (patch: ParamPatch, opts: { resetPage?: boolean } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === "") next.delete(key);
            else next.set(key, String(value));
          }
          if (opts.resetPage) next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    update(
      { q: undefined, type: undefined, from: undefined, to: undefined },
      { resetPage: true },
    );
  }, [update]);

  const query: TransactionQuery = {
    search: q || undefined,
    type,
    dateFrom: from || undefined,
    dateTo: to || undefined,
    sort,
    dir,
    page,
    pageSize: PAGE_SIZE,
  };

  const hasFilters = Boolean(q || type || from || to);

  return {
    q,
    type,
    from,
    to,
    sort,
    dir,
    page,
    query,
    hasFilters,
    update,
    clearFilters,
  };
}
