import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type BadgeProps,
} from "@/components/ui";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { formatDate } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/types";

const typeVariant: Record<TransactionType, BadgeProps["variant"]> = {
  deposit: "success",
  withdrawal: "neutral",
  transfer: "info",
};

const typeLabel: Record<TransactionType, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
};

/** Latest activity list — responsive rows, links through to full history. */
export function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent activity</CardTitle>
        <Link
          to="/transactions"
          className="text-body-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {transactions.map((txn) => {
            const displayMinor =
              txn.direction === "debit" ? -txn.amountMinor : txn.amountMinor;
            return (
              <li
                key={txn.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge variant={typeVariant[txn.type]} withDot>
                    {typeLabel[txn.type]}
                  </Badge>
                  <div className="min-w-0">
                    <p className="truncate text-body font-medium">
                      {txn.description}
                    </p>
                    <p className="text-caption text-foreground-muted">
                      {formatDate(txn.createdAt)}
                    </p>
                  </div>
                </div>
                <MoneyAmount
                  amountMinor={displayMinor}
                  signed
                  colorBySign
                  className="shrink-0 text-body font-semibold"
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
