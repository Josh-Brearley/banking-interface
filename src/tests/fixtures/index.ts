import type { Account, DashboardSummary, Transaction, User } from "@/types";

/** Typed factories for tests — specs/04-testing-strategy.md §2. */

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "usr_test",
    fullName: "Test User",
    email: "test@eaglebank.com",
    phoneNumber: "+447700900000",
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: "acc_test",
    userId: "usr_test",
    name: "Test Current",
    type: "current",
    status: "active",
    accountNumber: "20581234",
    sortCode: "20-00-00",
    balanceMinor: 100000,
    currency: "GBP",
    openedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    id: "txn_test",
    accountId: "acc_test",
    type: "withdrawal",
    direction: "debit",
    status: "completed",
    amountMinor: 4599,
    currency: "GBP",
    description: "Test Merchant",
    createdAt: "2026-05-01T12:00:00.000Z",
    ...overrides,
  };
}

export function makeDashboardSummary(
  overrides: Partial<DashboardSummary> = {},
): DashboardSummary {
  return {
    totalBalanceMinor: 348215,
    currency: "GBP",
    monthlyDepositsMinor: 285000,
    monthlyWithdrawalsMinor: 50000,
    accountsCount: 3,
    recentTransactions: [
      makeTransaction({
        id: "txn_a",
        type: "deposit",
        direction: "credit",
        amountMinor: 285000,
        description: "Salary - Acme Ltd",
        createdAt: "2026-05-28T08:00:00.000Z",
      }),
      makeTransaction({
        id: "txn_b",
        description: "Tesco",
        amountMinor: 4599,
        createdAt: "2026-05-27T18:00:00.000Z",
      }),
    ],
    ...overrides,
  };
}
