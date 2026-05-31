import { Card, CardContent } from "@/components/atoms";
import { MoneyAmount } from "@/components/molecules/MoneyAmount";
import { maskAccountNumber } from "@/lib/utils";
import type { Account } from "@/types";
import { AccountStatusBadge, AccountTypeBadge } from "./AccountBadges";

/** Mobile representation of an account. */
export function AccountCard({ account }: { account: Account }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-body font-semibold">{account.name}</p>
            <p className="font-mono text-body-sm text-foreground-muted">
              {maskAccountNumber(account.accountNumber)}
            </p>
          </div>
          <MoneyAmount
            amountMinor={account.balanceMinor}
            className="shrink-0 text-body font-semibold"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AccountTypeBadge type={account.type} />
          <AccountStatusBadge status={account.status} />
        </div>
      </CardContent>
    </Card>
  );
}
