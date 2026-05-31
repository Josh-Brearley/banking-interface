import { StatCard } from "@/components/molecules/StatCard";
import { MoneyAmount } from "@/components/molecules/MoneyAmount";
import { CardGraphic } from "@/components/molecules/CardGraphic";
import { IconArrowDownRight, IconArrowUpRight } from "@/components/atoms";
import type { DashboardSummary } from "@/types";

/**
 * This month's money flow, the two real figures we have. Total balance lives
 * in the hero card, so this row focuses on money in vs. money out.
 */
export function BalanceSummary({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard
        label="Money in this month"
        value={
          <MoneyAmount
            amountMinor={summary.monthlyDepositsMinor}
            className="text-success"
          />
        }
        icon={<IconArrowDownRight />}
        iconClassName="bg-success-subtle text-success"
        graphic={<CardGraphic tone="success" />}
      />
      <StatCard
        label="Money out this month"
        value={<MoneyAmount amountMinor={summary.monthlyWithdrawalsMinor} />}
        icon={<IconArrowUpRight />}
        iconClassName="bg-danger-subtle text-danger"
        graphic={<CardGraphic tone="danger" />}
      />
    </div>
  );
}
