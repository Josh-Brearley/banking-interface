# Feature Spec — Accounts

> Status: Approved · Feature ID: `ACCT` · Owner: Money squad
> Inherits: [00](../00-product-constitution.md) · [02](../02-design-system.md) · [03](../03-api-and-data.md) · [05](../05-cross-cutting.md)

## 1. Overview

`/accounts` lists the user's banking products across types (savings, credit, current) with
search and sorting. **Desktop → table; mobile → cards** (the `DataTable` pattern). Backed by
`GET /api/accounts` ([03 §4.3](../03-api-and-data.md#43-accounts--accountsservicets)).

## 2. User stories
- As a customer with several products, I can **see all my accounts** with key details.
- I can **search** to find an account by name or number.
- I can **sort** to compare balances or group by type/status.

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| `ACCT-FR-01` | List accounts showing **Name, Account Number (masked), Balance, Status, Type**. |
| `ACCT-FR-02` | **Desktop:** accessible table layout. |
| `ACCT-FR-03` | **Mobile:** card layout (same data, stacked). |
| `ACCT-FR-04` | **Search** filters by name and masked number (debounced); state in URL (`?q=`). |
| `ACCT-FR-05` | **Sort** by name, balance, type, status, asc/desc; state in URL (`?sort=&dir=`); `aria-sort` reflects current. |
| `ACCT-FR-06` | `status` shown as a **Badge** with semantic colour + text. |
| `ACCT-FR-07` | `type` shown as a Badge/label; account number masked (`•••• 4821`). |
| `ACCT-FR-08` | **Loading** → skeleton rows/cards; **Empty** → EmptyState; **Error** → ErrorState + retry. |
| `ACCT-FR-09` | Empty **search result** shows a distinct "no matches for '<q>'" empty state with a clear action. |
| `ACCT-FR-10` | Balances formatted GBP from minor units (`MoneyAmount`, `tabular-nums`). |

## 4. Design

### 4.1 Components (`features/accounts/`)
- `pages/AccountsPage`
- `components/AccountsTable` (desktop) / `AccountCard` (mobile) — composed via shared `DataTable<Account>`
- `components/AccountStatusBadge`, `AccountTypeBadge`
- `hooks/useAccounts(query)` → `useQuery(queryKeys.accounts.list(query), () => listAccounts(query))`

### 4.2 Table columns
| Column | Accessor | Sortable | Mobile card slot |
|--------|----------|----------|------------------|
| Name | `name` | ✓ | title |
| Number | masked `accountNumber` | – | subtitle (mono) |
| Type | `type` badge | ✓ | meta |
| Status | `status` badge | ✓ | meta |
| Balance | `balanceMinor` | ✓ | right-aligned value |

### 4.3 State
- Search/sort/dir read from and written to **URL search params** (`NFR-PERF-05`,
  shareable). `useDebounce` on the search input before pushing to the URL.
- Filtering/sorting may execute client-side via helpers in `lib/utils` but go through the
  `listAccounts(query)` service to model the real contract.

## 5. Acceptance criteria

```gherkin
# ACCT-AC-01  Displays accounts with required fields
Given I have accounts
When /accounts loads
Then each account shows name, masked number, type, status and balance

# ACCT-AC-02  Desktop table / mobile cards
Given a desktop viewport
Then accounts render in a table with column headers
Given a 375px viewport
Then accounts render as stacked cards with the same information

# ACCT-AC-03  Search by name
When I type "savings" in search
Then only accounts whose name (or number) matches are shown
And the URL contains q=savings

# ACCT-AC-04  Search no results
When I search a term matching nothing
Then a "no matches" empty state with a clear-search action is shown

# ACCT-AC-05  Sort by balance
When I activate the Balance column header
Then rows order by balance ascending and aria-sort="ascending"
When I activate it again
Then rows order descending and aria-sort="descending"

# ACCT-AC-06  Status badge semantics
Then an "active" account shows a success badge with the text "Active" (not colour alone)

# ACCT-AC-07  Loading / Error
Given the request is pending
Then skeleton rows are shown
Given the request fails
Then an error state with Retry is shown and Retry refetches

# ACCT-AC-08  Account number masked
Then full account numbers are not rendered; only the last 4 digits are shown
```

## 6. Edge cases
- Single account → still renders table/card cleanly (no empty state).
- `frozen`/`closed`/`pending` statuses each have a distinct badge variant.
- Very large balances and negative (credit) balances format correctly.
- Search + sort combine (search narrows, sort orders the result).

## 7. Tasks
- [ ] `useAccounts` hook + URL param sync (`q/sort/dir`).
- [ ] `DataTable<Account>` integration (responsive table/card).
- [ ] `AccountStatusBadge`, `AccountTypeBadge`, masked number util.
- [ ] Sort controls with `aria-sort`; debounced `SearchInput`.
- [ ] Loading/empty/no-result/error states.
- [ ] Tests `ACCT-AC-03..05, 07` (search, sort, states).

## 8. Test plan
Integration: render `AccountsPage` (MSW), assert fields present; type search and assert
filtered rows + URL; click sortable header and assert order + `aria-sort`; failing handler →
ErrorState + retry; matching-nothing search → no-results empty state.
