# 04 — Testing Strategy

> Status: Approved · Inherits: [00](./00-product-constitution.md)
> Tooling: **Vitest** + **React Testing Library** (+ `@testing-library/user-event`, `jest-dom`), optional **MSW**.

Tests assert **user-observable behaviour** and trace to requirement IDs (`ARCH-NFR-08`).
We do not test implementation details (internal state, class names, function call counts).

---

## 1. Test pyramid

| Layer                       | Share | What                                                                                             | Tool                   |
| --------------------------- | ----- | ------------------------------------------------------------------------------------------------ | ---------------------- |
| **Unit**                    | ~40%  | Pure logic: formatters (`formatMoney`), sort/filter/paginate helpers, Zod schemas.               | Vitest                 |
| **Component / integration** | ~55%  | Components & feature flows rendered with providers; user interactions; query/error/empty states. | RTL + user-event + MSW |
| **E2E (optional/future)**   | ~5%   | Critical happy paths across routes.                                                              | Playwright (future)    |

We bias toward **integration tests** that render a feature with a real `QueryClient` and
mocked services/MSW — they give the most confidence per test for this app.

---

## 2. Setup & conventions

- `src/tests/setup.ts` — `@testing-library/jest-dom`, RTL cleanup, MSW server lifecycle.
- `src/tests/renderWithProviders.tsx` — wraps UI in `QueryClientProvider` (fresh client,
  `retry: false`), `AuthProvider`, and `MemoryRouter` with configurable `initialEntries`.
- `src/tests/fixtures/` — typed factories (`makeUser`, `makeAccount`, `makeTransaction`).
- `src/tests/msw/handlers.ts` — default happy-path handlers; tests override per-case for
  error/empty scenarios (`server.use(...)`).
- Query by **role / label / text** (a11y-first). Avoid `data-testid` unless no semantic query exists.
- Each `it()` name SHOULD reference behaviour and MAY cite the requirement ID in a comment.

```ts
// Example
it("shows an error when credentials are rejected", async () => {
  // AUTH-AC-04
});
```

---

## 3. Required coverage (assessment minimum)

These MUST exist and pass. IDs map to feature-spec acceptance criteria.

### Authentication

- **Login validation** — empty fields, invalid email, password rules show inline errors;
  submit disabled/guarded while invalid (`AUTH-AC-01..03`).
- **Registration validation** — required fields, email format, password strength, **password
  confirmation match** (`AUTH-AC-05..07`).
- **Protected routes** — unauthenticated access to a protected route redirects to `/login`
  and preserves intended path; authenticated user reaches it (`AUTH-AC-09..10`).
- Login error state on rejected credentials (`AUTH-AC-04`).

### Profile

- **Form validation** — invalid email/phone/required fields block submit with messages (`PROF-AC-02..03`).
- **Successful update** — valid edit calls service, shows success feedback, reflects new
  values; cache/query updated (`PROF-AC-04..05`).

### Transactions

- **Filtering** — search term and date-range narrow the list to expected rows; empty result
  shows EmptyState (`TXN-AC-02..04`).
- **Sorting** — sort by date and by amount reorders rows; `aria-sort` reflects state
  (`TXN-AC-05..06`).

### Design system (recommended)

- Button loading/disabled semantics; Input error wiring (`aria-invalid`/`aria-describedby`);
  Modal focus trap + `Esc` close.

---

## 4. What good tests look like here

- **Render → act as a user → assert visible outcome.** e.g. type into fields, click submit,
  await the error message or navigation.
- **Async** handled with `findBy*` / `waitFor`; no arbitrary `sleep`.
- **States covered:** every data view has a loading test (skeleton/`aria-busy`), an empty
  test (EmptyState), and an error test (ErrorState + retry).
- **A11y assertions** baked in: assert labels, roles, `aria-*`, focus location after actions.

---

## 5. Scripts & quality gates

```
test          → vitest run
test:watch    → vitest
test:cov      → vitest run --coverage   (target: ≥80% lines on lib/ & services/, meaningful—not vanity—on UI)
typecheck     → tsc --noEmit
lint          → eslint .
```

CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs `lint`, `typecheck`,
`test:cov` and `build` on every PR and push to `main`. A red gate blocks merge.

---

## 6. Coverage philosophy

Coverage is a **floor signal, not a goal**. We prioritise covering the required behaviours
above and every error/empty/loading branch over chasing a percentage on trivial code.
