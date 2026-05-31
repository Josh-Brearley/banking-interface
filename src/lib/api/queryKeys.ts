import type { AccountQuery } from "@/services/accounts.service";
import type { TransactionQuery } from "@/services/transactions.service";

/**
 * Hierarchical, typed React Query key factory — specs/03-api-and-data.md §6.
 * List keys embed the full query object so each filter/sort/page combo caches
 * independently.
 */
export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  dashboard: {
    summary: () => ["dashboard", "summary"] as const,
  },
  accounts: {
    all: () => ["accounts"] as const,
    list: (query: AccountQuery) => ["accounts", "list", query] as const,
    detail: (id: string) => ["accounts", "detail", id] as const,
  },
  transactions: {
    all: () => ["transactions"] as const,
    list: (query: TransactionQuery) =>
      ["transactions", "list", query] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
  },
  profile: {
    me: () => ["profile", "me"] as const,
  },
} as const;
