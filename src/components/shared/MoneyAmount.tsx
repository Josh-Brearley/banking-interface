import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import type { CurrencyCode } from "@/types";

interface MoneyAmountProps {
  amountMinor: number;
  currency?: CurrencyCode;
  /** Prefix positive values with "+" (negatives always show "−"). */
  signed?: boolean;
  /** Colour by sign — green positive, red negative. Sign is always textual too. */
  colorBySign?: boolean;
  className?: string;
}

/** Formats minor units; tabular figures so columns align. NFR-FMT-01. */
export function MoneyAmount({
  amountMinor,
  currency = "GBP",
  signed = false,
  colorBySign = false,
  className,
}: MoneyAmountProps) {
  const tone = colorBySign
    ? amountMinor > 0
      ? "text-success"
      : amountMinor < 0
        ? "text-danger"
        : undefined
    : undefined;

  return (
    <span className={cn("tabular-nums", tone, className)}>
      {formatMoney(amountMinor, currency, { signed })}
    </span>
  );
}
