import transactionsSeed from "@/data/transactions.json";
import { ApiError, simulateNetwork } from "@/lib/api/client";
import type { Paginated, Transaction, TransactionType } from "@/types";

export interface TransactionQuery {
  search?: string;
  type?: TransactionType;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "date" | "amount";
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

const transactions = transactionsSeed as Transaction[];

const DEFAULT_PAGE_SIZE = 10;

function matchesSearch(txn: Transaction, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    txn.description.toLowerCase().includes(q) ||
    (txn.counterparty?.toLowerCase().includes(q) ?? false) ||
    (txn.reference?.toLowerCase().includes(q) ?? false)
  );
}

function withinRange(txn: Transaction, from?: string, to?: string): boolean {
  const time = new Date(txn.createdAt).getTime();
  if (from && time < new Date(from).getTime()) return false;
  // `to` is inclusive of the whole day.
  if (to && time > new Date(to).getTime() + 86_399_999) return false;
  return true;
}

/** GET /api/transactions — paginated. specs/03-api-and-data.md §4.4. */
export function listTransactions(
  query: TransactionQuery = {},
): Promise<Paginated<Transaction>> {
  return simulateNetwork(() => {
    const {
      search = "",
      type,
      accountId,
      dateFrom,
      dateTo,
      sort = "date",
      dir = "desc",
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = query;

    const filtered = transactions.filter(
      (t) =>
        matchesSearch(t, search) &&
        (!type || t.type === type) &&
        (!accountId || t.accountId === accountId) &&
        withinRange(t, dateFrom, dateTo),
    );

    const sorted = [...filtered].sort((a, b) => {
      const cmp =
        sort === "amount"
          ? a.amountMinor - b.amountMinor
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dir === "asc" ? cmp : -cmp;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return { items, page: safePage, pageSize, total, totalPages };
  });
}

/** GET /api/transactions/:id */
export function getTransaction(id: string): Promise<Transaction> {
  return simulateNetwork(() => {
    const txn = transactions.find((t) => t.id === id);
    if (!txn) {
      throw new ApiError(
        404,
        "TRANSACTION_NOT_FOUND",
        "Transaction not found.",
      );
    }
    return txn;
  });
}
