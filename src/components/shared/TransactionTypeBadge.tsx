import { Badge, type BadgeProps } from "@/components/ui";
import type { TransactionType } from "@/types";

const variant: Record<TransactionType, BadgeProps["variant"]> = {
  deposit: "success",
  withdrawal: "neutral",
  transfer: "info",
};

const label: Record<TransactionType, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
};

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return (
    <Badge variant={variant[type]} withDot>
      {label[type]}
    </Badge>
  );
}
