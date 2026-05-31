import accountsSeed from "@/data/accounts.json";
import transactionsSeed from "@/data/transactions.json";
import { simulateNetwork } from "@/lib/api/client";
import type { Account, DashboardSummary, Transaction } from "@/types";

const accounts = accountsSeed as Account[];
const transactions = transactionsSeed as Transaction[];

function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getUTCFullYear() === ref.getUTCFullYear() &&
    d.getUTCMonth() === ref.getUTCMonth()
  );
}

/** GET /api/dashboard/summary — specs/03-api-and-data.md §4.2. */
export function getSummary(): Promise<DashboardSummary> {
  return simulateNetwork(() => {
    const now = new Date();
    const monthly = transactions.filter(
      (t) => t.status === "completed" && isSameMonth(t.createdAt, now),
    );

    const totalBalanceMinor = accounts.reduce(
      (sum, a) => sum + a.balanceMinor,
      0,
    );
    const monthlyDepositsMinor = monthly
      .filter((t) => t.direction === "credit")
      .reduce((sum, t) => sum + t.amountMinor, 0);
    const monthlyWithdrawalsMinor = monthly
      .filter((t) => t.direction === "debit")
      .reduce((sum, t) => sum + t.amountMinor, 0);

    const recentTransactions = [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    return {
      totalBalanceMinor,
      currency: "GBP",
      monthlyDepositsMinor,
      monthlyWithdrawalsMinor,
      accountsCount: accounts.length,
      recentTransactions,
    };
  });
}
