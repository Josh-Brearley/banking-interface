# Feature Spec — Transactions

> Status: Approved · Feature ID: `TXN` · Owner: Money squad
> Inherits: [00](../00-product-constitution.md) · [02](../02-design-system.md) · [03](../03-api-and-data.md) · [05](../05-cross-cutting.md)

## 1. Overview

`/transactions` is the full transaction history with search, date-range filtering, sorting
(date/amount), pagination, and a **detail drawer**. Backed by `GET /api/transactions`
(paginated — [03 §4.4](../03-api-and-data.md#44-transactions--transactionsservicets)).

## 2. User stories
- As a customer, I can **browse and page through** my transaction history.
- I can **search** and **filter by date range** and **type** to find a transaction.
- I can **sort** by date or amount.
- I can open a transaction to see its **full details**.

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| `TXN-FR-01` | List transactions with date, description, type badge, status, signed amount. |
| `TXN-FR-02` | **Search** by description/counterparty/reference (debounced), URL `?q=`. |
| `TXN-FR-03` | **Date-range filter** (`from`/`to`), inclusive, URL `?from=&to=`. |
| `TXN-FR-04` | **Type filter** (deposit/withdrawal/transfer/all), URL `?type=`. |
| `TXN-FR-05` | **Sort by date** and **by amount**, asc/desc, URL `?sort=&dir=`; `aria-sort`. |
| `TXN-FR-06` | **Pagination** (page/pageSize), URL `?page=`; accessible controls; `placeholderData` keeps previous page during fetch. |
| `TXN-FR-07` | **Detail drawer/modal** opens on row activation showing full transaction info; focus-trapped; `Esc`/close restores focus (`DS-FR-15/16`). |
| `TXN-FR-08` | **Loading** → skeleton rows; **Empty** → EmptyState; **Error** → ErrorState + retry. |
| `TXN-FR-09` | Distinct **filtered-empty** state ("no transactions match your filters") with a **clear filters** action. |
| `TXN-FR-10` | Amounts signed & coloured by direction (credit `+`/success, debit `−`/danger) — sign always present (`NFR-A11Y-07`). |
| `TXN-FR-11` | Responsive: table on desktop, cards on mobile. |
| `TXN-FR-12` | Filters/sort/page are **shareable via URL** and survive refresh & back/forward. |

## 4. Design

### 4.1 Components (`features/transactions/`)
- `pages/TransactionsPage`
- `components/TransactionFilters` (SearchInput, DateRange, type Select, clear-all)
- `components/TransactionsTable` / `TransactionCard` (via `DataTable<Transaction>`)
- `components/TransactionDetailDrawer`
- `components/TransactionAmount` (signed `MoneyAmount`)
- `hooks/useTransactions(query)` → `useQuery(queryKeys.transactions.list(query), …, { placeholderData: keepPreviousData })`
- `hooks/useTransaction(id)` for the drawer (or read from list cache first)

### 4.2 Query/URL model
All of `q, type, from, to, sort, dir, page` live in URL search params. A `useTransactionQuery()`
hook parses/serialises them (with Zod) into the `TransactionQuery` object passed to the service.
Changing a filter resets `page` to 1.

### 4.3 Detail drawer
Right-side `Drawer` (bottom sheet on mobile). Shows: amount (large, signed), type, status,
description, counterparty, reference, account, date/time, category. Opened via row
button/click; the open transaction id MAY be reflected in URL (`?txn=<id>`) for deep-linking.

## 5. Acceptance criteria

```gherkin
# TXN-AC-01  Paginated list renders
Given I have many transactions
When /transactions loads
Then the first page (pageSize default) of transactions renders newest-first

# TXN-AC-02  Search filter
When I type "salary" in search
Then only transactions matching description/counterparty/reference are shown
And the URL reflects q=salary and page resets to 1

# TXN-AC-03  Date-range filter
When I set from and to dates
Then only transactions within the inclusive range are shown
And the URL reflects from/to

# TXN-AC-04  Filtered empty state
When filters match no transactions
Then a "no transactions match your filters" empty state with a Clear filters action is shown
And Clear filters restores the unfiltered list

# TXN-AC-05  Sort by date
When I sort by date ascending
Then rows order oldest-first and the date header aria-sort="ascending"

# TXN-AC-06  Sort by amount
When I sort by amount descending
Then rows order by largest amount first and the amount header aria-sort="descending"

# TXN-AC-07  Pagination
When I go to page 2
Then the next set of transactions renders, the URL reflects page=2,
And the previous page stays visible until the new page loads (no flash to empty)

# TXN-AC-08  Detail drawer
When I activate a transaction row
Then a focus-trapped drawer opens with the full transaction details
And pressing Esc closes it and returns focus to the originating row

# TXN-AC-09  Loading / Error
Given the request is pending
Then skeleton rows are shown
Given the request fails
Then an ErrorState with Retry is shown and Retry refetches

# TXN-AC-10  Signed amounts
Then deposits show a leading "+" (success) and withdrawals a leading "−" (danger),
And the sign is present regardless of colour
```

## 6. Edge cases
- `from` after `to` → validation message, no broken query.
- Combined filters (search + date + type) intersect correctly; clearing one keeps the others.
- Last page partial; empty final page guard (clamp page to `totalPages`).
- Pending/failed transactions display their status badge.
- Refresh on a filtered/paged URL restores exactly that view (`TXN-FR-12`).

## 7. Tasks
- [ ] `useTransactionQuery` (URL ↔ `TransactionQuery`, Zod-parsed, page-reset on filter change).
- [ ] `useTransactions` with `keepPreviousData`.
- [ ] `TransactionFilters` (search, date range, type, clear-all).
- [ ] `DataTable<Transaction>` with sortable date/amount (`aria-sort`).
- [ ] `Pagination` wiring.
- [ ] `TransactionDetailDrawer` (focus trap, Esc, focus restore).
- [ ] `TransactionAmount` signed formatting.
- [ ] Loading/empty/filtered-empty/error states.
- [ ] Tests `TXN-AC-02..06` (filter & sort are required coverage), plus drawer a11y.

## 8. Test plan (filtering & sorting are [04 §3](../04-testing-strategy.md#3-required-coverage-assessment-minimum) minimums)
Integration with MSW serving a known dataset: assert search narrows rows + URL; date-range
narrows rows; clear-filters restores; sort-by-date and sort-by-amount reorder + `aria-sort`;
pagination advances + keeps previous page; drawer opens, traps focus, Esc restores focus.
