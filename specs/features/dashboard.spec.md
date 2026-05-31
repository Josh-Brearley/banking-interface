# Feature Spec: Dashboard

> Status: Approved · Feature ID: `DASH` · Owner: Money squad
> Inherits: [00](../00-product-constitution.md) · [03](../03-api-and-data.md) · [05](../05-cross-cutting.md)

## 1. Overview

The post-login home (`/dashboard`). A scannable financial overview: a personal welcome,
headline balance, monthly in/out, recent activity, and quick actions. Backed by
`GET /api/dashboard/summary` ([03 §4.2](../03-api-and-data.md#42-dashboard--dashboardservicets)).

## 2. User stories

- As a customer, I see my **total balance** and this month's **money in/out** at a glance.
- I see my **most recent transactions** without leaving the dashboard.
- I can jump to common tasks via **quick actions**.

## 3. Functional requirements

| ID           | Requirement                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `DASH-FR-01` | **Welcome message** with the user's first name (from `useAuth`).                                          |
| `DASH-FR-02` | **Total balance** StatCard (sum across accounts), formatted GBP.                                          |
| `DASH-FR-03` | **Monthly deposits** StatCard (current month credits).                                                    |
| `DASH-FR-04` | **Monthly withdrawals** StatCard (current month debits).                                                  |
| `DASH-FR-05` | **Recent transactions** list (latest 5), newest first, with type badge, description, date, signed amount. |
| `DASH-FR-06` | **Quick actions:** Transfer Money, View Accounts, View Transactions, Manage Profile.                      |
| `DASH-FR-07` | **Loading** state renders skeletons for stat cards and the recent list (`NFR-PERF-08`).                   |
| `DASH-FR-08` | **Empty** state when the user has no accounts/transactions, with guidance.                                |
| `DASH-FR-09` | **Error** state with retry wired to `refetch` (`NFR-ERR-03`).                                             |
| `DASH-FR-10` | Fully **responsive**: stat cards stack on mobile, grid on desktop.                                        |

## 4. Design

### 4.1 Layout

- `PageHeader` with greeting (`DASH-FR-01`).
- Responsive grid of 3 `StatCard`s (balance / deposits / withdrawals).
- `Card` "Recent activity" → list of up to 5 `TransactionRow`s + a "View all" link to `/transactions`.
- Quick actions row of 4 action cards/buttons with icons.

### 4.2 Components (`features/dashboard/`)

- `pages/DashboardPage`
- `components/BalanceSummary` (the 3 stat cards), `RecentTransactions`, `QuickActions`
- `hooks/useDashboardSummary` → `useQuery(queryKeys.dashboard.summary(), getSummary)`

### 4.3 Quick action targets

| Action            | Behaviour                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Transfer Money    | Opens a Transfer modal/route (UI only, no real movement, see [00 §5](../00-product-constitution.md#5-scope)). |
| View Accounts     | Navigate `/accounts`.                                                                                          |
| View Transactions | Navigate `/transactions`.                                                                                      |
| Manage Profile    | Navigate `/profile`.                                                                                           |

### 4.4 Data

`useDashboardSummary` returns `DashboardSummary`. Amounts are minor units → `MoneyAmount`.
Deposits shown positive/success; withdrawals shown with `−` sign/danger colour (paired with
sign, not colour alone, `NFR-A11Y-07`).

## 5. Acceptance criteria

```gherkin
# DASH-AC-01  Personalised greeting
Given I am authenticated as "Priya Shah"
When the dashboard loads
Then I see a greeting containing "Priya"

# DASH-AC-02  Summary figures
Given the summary returns totals
Then the total balance, monthly deposits, and monthly withdrawals are displayed formatted as GBP

# DASH-AC-03  Recent transactions
Given the summary includes recent transactions
Then up to 5 are listed newest-first with type, description, date and signed amount
And a "View all" link navigates to /transactions

# DASH-AC-04  Loading skeletons
Given the summary request is pending
Then skeletons are shown for the stat cards and recent list (aria-busy)

# DASH-AC-05  Empty state
Given the user has no accounts or transactions
Then an empty state with guidance and a relevant action is shown

# DASH-AC-06  Error + retry
Given the summary request fails
Then an error state with a Retry button is shown
And clicking Retry refetches the summary

# DASH-AC-07  Quick actions navigate
When I activate "View Accounts"
Then I navigate to /accounts
# (and equivalently for Transactions, Profile; Transfer opens the transfer UI)

# DASH-AC-08  Responsive layout
Given a 375px viewport
Then the stat cards stack vertically and remain readable
```

## 6. Edge cases

- New user (zero data) → friendly empty state, not zeros-with-no-context (still may show £0.00 balance with guidance).
- Negative net month handled (withdrawals > deposits) without layout break.
- Greeting falls back to "Welcome" if name missing.

## 7. Tasks

- [ ] `useDashboardSummary` hook.
- [ ] `BalanceSummary` (3 StatCards) + skeleton variant.
- [ ] `RecentTransactions` list + empty/loading.
- [ ] `QuickActions` (a11y: buttons/links with labels + icons `aria-hidden`).
- [ ] `DashboardPage` wiring loading/empty/error.
- [ ] Tests `DASH-AC-01..08` (greeting, figures, loading, empty, error+retry).

## 8. Test plan

Integration test rendering `DashboardPage` with MSW: assert greeting, formatted figures,
recent list order, skeleton on pending, EmptyState on empty handler, ErrorState + retry on
failing handler, quick-action navigation.
