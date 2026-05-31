import { StatCard } from "@/components/shared/StatCard";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import type { DashboardSummary } from "@/types";

/** Three headline figures — responsive: stacked on mobile, 3-up from md. */
export function BalanceSummary({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Total balance"
        value={<MoneyAmount amountMinor={summary.totalBalanceMinor} />}
        hint={`Across ${summary.accountsCount} account${summary.accountsCount === 1 ? "" : "s"}`}
      />
      <StatCard
        label="Money in this month"
        value={
          <MoneyAmount
            amountMinor={summary.monthlyDepositsMinor}
            className="text-success"
          />
        }
      />
      <StatCard
        label="Money out this month"
        value={
          <MoneyAmount
            amountMinor={summary.monthlyWithdrawalsMinor}
            className="text-danger"
          />
        }
      />
    </div>
  );
}
