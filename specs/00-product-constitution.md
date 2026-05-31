# 00 — Product Constitution

> Status: Approved · Owner: Frontend Platform · Inherited by: **all** specs

The constitution defines the principles every other spec and every line of code must
honour. When a feature spec and the constitution conflict, the constitution wins.

---

## 1. Vision

Eagle Bank is a **modern retail banking web platform**. It should feel as fast,
trustworthy, and calm as Monzo, Revolut, Chase UK, or modern Barclays digital — clean,
professional, minimal, never flashy. The frontend is built to be evolved into a real
production system: multi-team, multi-product, micro-frontend-ready, and backed by real
APIs in future.

This codebase mocks the backend with local JSON + a service layer. **No real backend
exists**, but the frontend is written as though one does — service boundaries, error
handling, loading states, and caching are all production-shaped.

---

## 2. Engineering principles (non-negotiable)

| ID            | Principle                                         | What it means in practice                                                                                                                             |
| ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ARCH-NFR-01` | **Feature-first architecture**                    | Code is organised by feature/domain, not by file type. Features are independently ownable and removable. See [01-architecture](./01-architecture.md). |
| `ARCH-NFR-02` | **Strict module boundaries**                      | Features MUST NOT import from each other's internals. Shared code lives in `components/`, `lib/`, `hooks/`, `services/`, `types/`.                    |
| `ARCH-NFR-03` | **Type safety end to end**                        | `strict` TypeScript. No `any` in committed code (lint error). Runtime data validated with Zod at the boundary.                                        |
| `ARCH-NFR-04` | **Server state ≠ client state**                   | Remote data is owned by TanStack Query. Local UI state uses React state/context. Never duplicate server state into local state.                       |
| `ARCH-NFR-05` | **Accessibility is a feature, not a polish step** | Every component ships keyboard + screen-reader support. A PR that regresses a11y is a broken PR.                                                      |
| `ARCH-NFR-06` | **Small, composable units**                       | Components do one thing. Files trend small; large files are a smell, not a milestone. No prop drilling beyond one level — lift to context or compose. |
| `ARCH-NFR-07` | **Every state has a UI**                          | Loading, empty, error, and success are designed for every data-driven view. "Happy path only" is incomplete.                                          |
| `ARCH-NFR-08` | **Tests express intent**                          | Tests assert user-observable behaviour and trace to a requirement ID. We test behaviour, not implementation details.                                  |
| `ARCH-NFR-09` | **Performance budget is a contract**              | Route-level code splitting, lazy loading, memoisation where it pays. Lighthouse Performance & Accessibility ≥ 90.                                     |
| `ARCH-NFR-10` | **Motion serves usability**                       | Animations are subtle and purposeful, respect `prefers-reduced-motion`, and never block interaction.                                                  |

---

## 3. Delivery priorities (tie-breaker order)

When trade-offs arise, resolve in this order:

1. **Architecture** — correctness of boundaries and types.
2. **Accessibility** — usable by everyone.
3. **Performance** — fast by default.
4. **Testing** — verified behaviour.
5. **User experience** — delight on top of the above.

A faster but inaccessible solution loses. A prettier but untested solution loses.

---

## 4. Personas

| Persona                       | Goal                                                                     | Implication                                                     |
| ----------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Priya — everyday customer** | Check balance, review transactions, transfer money on mobile in seconds. | Mobile-first, fast, low cognitive load, clear money formatting. |
| **Sam — accessibility user**  | Operate the entire app with a keyboard and screen reader.                | Full keyboard nav, focus management, ARIA, semantic HTML.       |
| **Engineering reviewer**      | Assess architecture, scalability, maintainability.                       | Clean boundaries, documented decisions, traceable specs/tests.  |

---

## 5. Scope

### In scope

Mocked auth, dashboard, accounts, transactions, profile; design system; error handling;
a11y; performance; tests; README of decisions.

### Out of scope (mocked or deferred)

Real backend, real money movement, real KYC, server-side rendering, push notifications,
multi-currency conversion logic. Transfer "Quick Action" navigates/opens UI but does not
move real money. Avatar upload is frontend-only (object URL / base64, not persisted to a server).

---

## 6. Glossary

| Term            | Definition                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| **Account**     | A banking product instance owned by a user (e.g. Savings, Credit). Has a balance, status, type, masked number. |
| **Transaction** | A money event on an account: `deposit`, `withdrawal`, or `transfer`.                                           |
| **Session**     | The persisted authenticated state (token + user) in LocalStorage.                                              |
| **Service**     | A module in `src/services/` that mimics a backend API call (latency, errors).                                  |
| **Minor units** | Money stored as integer pennies/cents to avoid float error. £12.34 → `1234`.                                   |

---

## 7. Definition of Done (per feature)

A feature is **Done** only when **all** are true:

- [ ] All `FR` requirements implemented and demoable.
- [ ] All `AC` acceptance criteria have passing automated tests.
- [ ] Loading, empty, and error states implemented (`ARCH-NFR-07`).
- [ ] Keyboard-navigable; screen-reader labelled; focus managed (`ARCH-NFR-05`).
- [ ] Responsive at mobile (375px), tablet (768px), desktop (1280px).
- [ ] No `any`, no console errors, lint + typecheck clean.
- [ ] Route lazy-loaded if it is a page (`ARCH-NFR-09`).
- [ ] `prefers-reduced-motion` respected for any animation (`ARCH-NFR-10`).
- [ ] README updated if an architectural decision was made.

---

## 8. Currency & locale defaults

- Locale: `en-GB`. Currency: `GBP`. Format via `Intl.NumberFormat`.
- Dates display via `Intl.DateTimeFormat` (`en-GB`); stored as ISO 8601 strings.
- Money is stored in **minor units (integer)** and only formatted at the view edge.
