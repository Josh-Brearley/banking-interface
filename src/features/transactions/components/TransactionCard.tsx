import { Card } from "@/components/ui";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { TransactionTypeBadge } from "@/components/shared/TransactionTypeBadge";
import { formatDate, signedMinor } from "@/lib/utils";
import type { Transaction } from "@/types";

/** Mobile representation of a transaction; the whole card opens the detail. */
export function TransactionCard({
  transaction,
  onView,
}: {
  transaction: Transaction;
  onView: (t: Transaction) => void;
}) {
  return (
    <Card className="p-0 transition-shadow hover:shadow-sm">
      <button
        type="button"
        onClick={() => onView(transaction)}
        aria-label={`View transaction: ${transaction.description}`}
        className="flex w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="min-w-0">
          <p className="truncate text-body font-medium">
            {transaction.description}
          </p>
          <p className="text-caption text-foreground-muted">
            {formatDate(transaction.createdAt)}
          </p>
          <div className="mt-2">
            <TransactionTypeBadge type={transaction.type} />
          </div>
        </div>
        <MoneyAmount
          amountMinor={signedMinor(
            transaction.amountMinor,
            transaction.direction,
          )}
          signed
          colorBySign
          className="shrink-0 text-body font-semibold"
        />
      </button>
    </Card>
  );
}
