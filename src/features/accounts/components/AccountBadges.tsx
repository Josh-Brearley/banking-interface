import { Badge, type BadgeProps } from "@/components/atoms";
import type { AccountStatus, AccountType } from "@/types";

const statusVariant: Record<AccountStatus, BadgeProps["variant"]> = {
  active: "success",
  pending: "warning",
  frozen: "info",
  closed: "neutral",
};

const statusLabel: Record<AccountStatus, string> = {
  active: "Active",
  pending: "Pending",
  frozen: "Frozen",
  closed: "Closed",
};

const typeLabel: Record<AccountType, string> = {
  savings: "Savings",
  credit: "Credit",
  current: "Current",
};

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <Badge variant={statusVariant[status]} withDot>
      {statusLabel[status]}
    </Badge>
  );
}

export function AccountTypeBadge({ type }: { type: AccountType }) {
  return <Badge variant="neutral">{typeLabel[type]}</Badge>;
}
