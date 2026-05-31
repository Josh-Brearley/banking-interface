/**
 * Shared domain types — the contract from specs/03-api-and-data.md.
 * Money is stored in integer minor units (pennies).
 */

export type CurrencyCode = "GBP";

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: Address;
  avatarUrl?: string;
  createdAt: string;
}

export type AccountType = "savings" | "credit" | "current";
export type AccountStatus = "active" | "frozen" | "closed" | "pending";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  accountNumber: string;
  sortCode: string;
  balanceMinor: number;
  currency: CurrencyCode;
  openedAt: string;
}

export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionDirection = "credit" | "debit";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  direction: TransactionDirection;
  status: TransactionStatus;
  amountMinor: number;
  currency: CurrencyCode;
  description: string;
  category?: string;
  counterparty?: string;
  reference?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface DashboardSummary {
  totalBalanceMinor: number;
  currency: CurrencyCode;
  monthlyDepositsMinor: number;
  monthlyWithdrawalsMinor: number;
  accountsCount: number;
  recentTransactions: Transaction[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
