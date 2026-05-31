# 03 — API & Data Contract

> Status: Approved · Inherits: [00](./00-product-constitution.md), [01](./01-architecture.md)
> Location: `src/types/`, `src/services/`, `src/lib/api/`, `src/data/`

This is the contract between the (mocked) backend and the UI. Feature specs reference these
types and endpoints rather than redefining them.

---

## 1. Domain types (`src/types/`)

Money is **integer minor units** (pennies). `amountMinor: 1234` ⇒ £12.34.

```ts
// money.ts
export type CurrencyCode = "GBP";
export interface Money {
  amountMinor: number; // integer; can be negative for debits in some contexts
  currency: CurrencyCode;
}

// user.ts
export interface User {
  id: string; // "usr_..."
  fullName: string;
  email: string;
  phoneNumber?: string; // E.164-ish, optional
  address?: Address;
  avatarUrl?: string; // object URL / data URL (frontend-only)
  createdAt: string; // ISO 8601
}
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string; // ISO 3166 alpha-2, default "GB"
}

// account.ts
export type AccountType = "savings" | "credit" | "current";
export type AccountStatus = "active" | "frozen" | "closed" | "pending";
export interface Account {
  id: string; // "acc_..."
  userId: string;
  name: string; // "Everyday Savings"
  type: AccountType;
  status: AccountStatus;
  accountNumber: string; // stored full; UI shows masked "•••• 4821"
  sortCode: string; // "20-00-00"
  balanceMinor: number; // integer minor units
  currency: CurrencyCode;
  openedAt: string; // ISO 8601
}

// transaction.ts
export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionDirection = "credit" | "debit";
export type TransactionStatus = "completed" | "pending" | "failed";
export interface Transaction {
  id: string; // "txn_..."
  accountId: string;
  type: TransactionType;
  direction: TransactionDirection; // credit = +balance, debit = −balance
  status: TransactionStatus;
  amountMinor: number; // always positive; sign derived from direction
  currency: CurrencyCode;
  description: string; // "Tesco", "Salary - Acme Ltd"
  category?: string; // "Groceries", "Income"…
  counterparty?: string; // for transfers
  reference?: string;
  createdAt: string; // ISO 8601 — used for date sort/filter
}

// auth.ts
export interface Session {
  token: string; // opaque mock JWT-like string
  user: User;
}
```

---

## 2. Mock data (`src/data/`)

- `users.json` — ≥1 seeded user (demo credentials below) with full profile.
- `accounts.json` — ≥3 accounts across types (savings, credit, current) and varied statuses.
- `transactions.json` — ≥60 transactions spanning ≥3 months, mixed types/directions/categories,
  enough to exercise pagination, date-range filtering, and empty-search results.

**Demo credentials** (documented in README):
`demo@eaglebank.com` / `Password123!`

Seed data is realistic: salary deposits, card spend withdrawals, transfers between own
accounts, a few `pending`/`failed` examples for state coverage.

---

## 3. Service layer contract (`src/services/`)

Each service is a set of async functions that **simulate** a backend. They MUST:

1. **Simulate latency** — random delay (e.g. 250–800ms) via `lib/api`.
2. **Simulate errors** — configurable failure rate / forced error hooks so error states are
   demoable and testable. Network errors throw `ApiError`.
3. **Return typed domain data** — never leak raw JSON shapes; map to `types/`.
4. **Be pure of React** — no hooks; consumed by React Query hooks in features.

```ts
// lib/api/client.ts (shim)
export class ApiError extends Error {
  constructor(
    public status: number, // 400,401,404,422,500…
    public code: string, // "INVALID_CREDENTIALS"…
    message: string,
    public fieldErrors?: Record<string, string>, // for 422 form errors
  ) {
    super(message);
  }
}
// delay(min,max), maybeFail(rate), simulateNetwork<T>(producer): Promise<T>
```

**Retry policy:** React Query retries network/5xx up to 2×; `ApiError` with 4xx status is
**not** retried (handled in query `retry` predicate).

---

## 4. Endpoint contracts

All paths are conceptual (no real server). Request/response shapes are the function
signatures of the services. Errors use the `ApiError` model (§3).

### 4.1 Auth — `auth.service.ts`

| Endpoint                  | Fn               | Request                         | Success             | Errors                                |
| ------------------------- | ---------------- | ------------------------------- | ------------------- | ------------------------------------- |
| `POST /api/auth/login`    | `login(body)`    | `{ email, password }`           | `Session`           | `401 INVALID_CREDENTIALS`             |
| `POST /api/auth/register` | `register(body)` | `{ fullName, email, password }` | `Session`           | `409 EMAIL_TAKEN`, `422` field errors |
| `POST /api/auth/logout`   | `logout()`       | —                               | `{ success: true }` | —                                     |
| `GET /api/auth/me`        | `me(token)`      | (token from storage)            | `User`              | `401 UNAUTHENTICATED`                 |

```jsonc
// POST /api/auth/login  → 200
{ "token": "mock.jwt.token", "user": { "id":"usr_1","fullName":"Priya Shah","email":"demo@eaglebank.com", … } }
// → 401
{ "status":401, "code":"INVALID_CREDENTIALS", "message":"Email or password is incorrect." }
```

### 4.2 Dashboard — `dashboard.service.ts`

| Endpoint                     | Fn             | Returns            |
| ---------------------------- | -------------- | ------------------ |
| `GET /api/dashboard/summary` | `getSummary()` | `DashboardSummary` |

```ts
interface DashboardSummary {
  totalBalanceMinor: number; // sum across accounts
  currency: CurrencyCode;
  monthlyDepositsMinor: number; // current calendar month credits
  monthlyWithdrawalsMinor: number; // current calendar month debits
  accountsCount: number;
  recentTransactions: Transaction[]; // latest 5, newest first
}
```

### 4.3 Accounts — `accounts.service.ts`

| Endpoint                | Fn                    | Request                    | Returns           |
| ----------------------- | --------------------- | -------------------------- | ----------------- |
| `GET /api/accounts`     | `listAccounts(query)` | `{ search?, sort?, dir? }` | `Account[]`       |
| `GET /api/accounts/:id` | `getAccount(id)`      | `id`                       | `Account` / `404` |

`sort ∈ { name, balance, type, status }`, `dir ∈ { asc, desc }`. Search matches name and
masked number. Filtering/sorting MAY be client-side but the service signature models the
server-side contract for future real APIs.

### 4.4 Transactions — `transactions.service.ts`

| Endpoint                    | Fn                        | Request   | Returns                  |
| --------------------------- | ------------------------- | --------- | ------------------------ |
| `GET /api/transactions`     | `listTransactions(query)` | see below | `Paginated<Transaction>` |
| `GET /api/transactions/:id` | `getTransaction(id)`      | `id`      | `Transaction` / `404`    |

```ts
interface TransactionQuery {
  search?: string; // matches description/counterparty/reference
  type?: TransactionType; // filter
  accountId?: string;
  dateFrom?: string; // ISO date (inclusive)
  dateTo?: string; // ISO date (inclusive)
  sort?: "date" | "amount"; // default "date"
  dir?: "asc" | "desc"; // default "desc"
  page?: number; // 1-based, default 1
  pageSize?: number; // default 10
}
interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number; // total matching rows (for page count)
  totalPages: number;
}
```

### 4.5 Profile — `profile.service.ts`

| Endpoint               | Fn                    | Request                                                             | Returns                      |
| ---------------------- | --------------------- | ------------------------------------------------------------------- | ---------------------------- | ------------------ |
| `GET /api/profile`     | `getProfile()`        | —                                                                   | `User`                       |
| `PATCH /api/profile`   | `updateProfile(body)` | `Partial<Pick<User,"fullName"\|"email"\|"phoneNumber"\|"address">>` | `User`                       | `422` field errors |
| (frontend-only) avatar | `setAvatar(file)`     | `File`                                                              | `{ avatarUrl }` (object URL) |

---

## 5. Validation at the boundary (`ARCH-NFR-03`)

- Form inputs validated with **Zod** (schemas in each feature's `schemas/`).
- Service responses MAY be parsed with Zod in dev to catch seed-data drift.
- A single Zod schema is the source of both the runtime check and the TS type (`z.infer`).

---

## 6. React Query keys

Centralised, hierarchical, typed key factory in `lib/api/queryKeys.ts`:

```ts
export const queryKeys = {
  auth: { me: () => ["auth", "me"] as const },
  dashboard: { summary: () => ["dashboard", "summary"] as const },
  accounts: {
    all: () => ["accounts"] as const,
    list: (q: AccountQuery) => ["accounts", "list", q] as const,
    detail: (id: string) => ["accounts", "detail", id] as const,
  },
  transactions: {
    all: () => ["transactions"] as const,
    list: (q: TransactionQuery) => ["transactions", "list", q] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
  },
  profile: { me: () => ["profile", "me"] as const },
};
```

**Invalidation rules:**

- `login`/`logout` → reset entire cache.
- `updateProfile` success → invalidate `profile.me()` and `auth.me()`.
- (future) transfer mutation → invalidate `accounts.all()`, `transactions.all()`, `dashboard.summary()`.

List queries include the full query object in the key so each filter/sort/page combination
is cached independently; `keepPreviousData`/`placeholderData` smooths pagination.
