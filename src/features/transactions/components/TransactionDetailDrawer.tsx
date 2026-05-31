import { Badge, Drawer } from "@/components/ui";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { TransactionTypeBadge } from "@/components/shared/TransactionTypeBadge";
import { formatDate, signedMinor } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/types";

const statusVariant: Record<
  TransactionStatus,
  "success" | "warning" | "danger"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-body-sm text-foreground-muted">{label}</dt>
      <dd className="text-body-sm font-medium">{value}</dd>
    </div>
  );
}

export function TransactionDetailDrawer({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={Boolean(transaction)}
      onClose={onClose}
      title="Transaction details"
    >
      {transaction && (
        <div>
          <div className="mb-4 flex flex-col items-start gap-2">
            <MoneyAmount
              amountMinor={signedMinor(
                transaction.amountMinor,
                transaction.direction,
              )}
              signed
              colorBySign
              className="text-display"
            />
            <div className="flex items-center gap-2">
              <TransactionTypeBadge type={transaction.type} />
              <Badge variant={statusVariant[transaction.status]}>
                {transaction.status[0]!.toUpperCase() +
                  transaction.status.slice(1)}
              </Badge>
            </div>
          </div>

          <dl className="divide-y divide-border">
            <Row label="Description" value={transaction.description} />
            <Row label="Counterparty" value={transaction.counterparty} />
            <Row label="Category" value={transaction.category} />
            <Row label="Reference" value={transaction.reference} />
            <Row
              label="Date"
              value={formatDate(transaction.createdAt, {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </dl>
        </div>
      )}
    </Drawer>
  );
}
