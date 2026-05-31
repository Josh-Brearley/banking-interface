import type { CurrencyCode } from "@/types";

const LOCALE = "en-GB";

/**
 * Format integer minor units as currency. NFR-FMT-01.
 * @example formatMoney(123456) // "£1,234.56"
 */
export function formatMoney(
  amountMinor: number,
  currency: CurrencyCode = "GBP",
  options: { signed?: boolean } = {},
): string {
  const value = amountMinor / 100;
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
  }).format(Math.abs(value));

  if (options.signed) {
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}${formatted}`;
  }
  return value < 0 ? `−${formatted}` : formatted;
}

/** Format an ISO date string for display. NFR-FMT-02. */
export function formatDate(
  iso: string,
  style: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(LOCALE, style).format(new Date(iso));
}

/** Mask an account number to its last four digits. NFR-FMT-03. */
export function maskAccountNumber(accountNumber: string): string {
  const last4 = accountNumber.slice(-4);
  return `•••• ${last4}`;
}

/** Signed minor units for display: debits are negative, credits positive. */
export function signedMinor(
  amountMinor: number,
  direction: "credit" | "debit",
): number {
  return direction === "debit" ? -amountMinor : amountMinor;
}

/** Initials from a full name, for avatar fallback. */
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
