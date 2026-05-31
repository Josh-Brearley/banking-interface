import accountsSeed from "@/data/accounts.json";
import { ApiError, simulateNetwork } from "@/lib/api/client";
import { maskAccountNumber } from "@/lib/utils";
import type { Account, AccountStatus, AccountType } from "@/types";

export interface AccountQuery {
  search?: string;
  sort?: "name" | "balance" | "type" | "status";
  dir?: "asc" | "desc";
}

const accounts = accountsSeed as Account[];

function matchesSearch(account: Account, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    account.name.toLowerCase().includes(q) ||
    maskAccountNumber(account.accountNumber).toLowerCase().includes(q) ||
    account.accountNumber.includes(q)
  );
}

function compare(a: Account, b: Account, sort: AccountQuery["sort"]): number {
  switch (sort) {
    case "balance":
      return a.balanceMinor - b.balanceMinor;
    case "type":
      return a.type.localeCompare(b.type);
    case "status":
      return a.status.localeCompare(b.status);
    case "name":
    default:
      return a.name.localeCompare(b.name);
  }
}

/** GET /api/accounts, specs/03-api-and-data.md §4.3. */
export function listAccounts(query: AccountQuery = {}): Promise<Account[]> {
  return simulateNetwork(() => {
    const filtered = accounts.filter((a) =>
      matchesSearch(a, query.search ?? ""),
    );
    const sorted = [...filtered].sort((a, b) => compare(a, b, query.sort));
    if (query.dir === "desc") sorted.reverse();
    return sorted;
  });
}

/** GET /api/accounts/:id */
export function getAccount(id: string): Promise<Account> {
  return simulateNetwork(() => {
    const account = accounts.find((a) => a.id === id);
    if (!account) {
      throw new ApiError(404, "ACCOUNT_NOT_FOUND", "Account not found.");
    }
    return account;
  });
}

export type { AccountStatus, AccountType };
