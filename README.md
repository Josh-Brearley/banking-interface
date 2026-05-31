# Eagle Bank

A modern, production-shaped banking frontend built with React, TypeScript and Vite. The
backend is **mocked** with local JSON and a service layer — no real backend is required.

> Built spec-first. The full specifications live in [`specs/`](./specs/README.md) and the
> branching/contribution workflow in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Quick start

```bash
nvm use            # Node 20+
npm install
npm run dev        # http://localhost:5173
```

**Demo login:** `demo@eaglebank.com` / `Password123!`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production. |
| `npm run preview` | Preview the production build. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint (zero warnings allowed). |
| `npm run test` / `test:watch` / `test:cov` | Vitest. |
| `npm run format` | Prettier write. |

## Tech stack

React 18 · TypeScript (strict) · Vite · React Router v6 · TanStack Query v5 · Tailwind CSS ·
class-variance-authority · React Hook Form · Zod · Framer Motion · Vitest · React Testing
Library · MSW.

## Architecture

Feature-first, with strict module boundaries. See [`specs/01-architecture.md`](./specs/01-architecture.md).

```
src/
├── app/         # router, providers, layouts (composition root)
├── features/    # auth, dashboard, accounts, transactions, profile (self-contained)
├── components/  # ui (design system) + shared widgets
├── lib/         # api, auth, validation, utils (framework-agnostic)
├── hooks/       # cross-feature hooks
├── services/    # mocked backend (latency + error simulation)
├── data/        # seed JSON
├── types/       # shared domain types
└── tests/       # setup, render helpers, fixtures
```

## Status

This branch (`chore/scaffold`) delivers the **foundation**: tooling, design tokens, core UI
primitives, the mock service layer + seed data, auth/session plumbing with protected routes,
the app shell, lazy-loaded routing, and the test harness. A minimal working **login** proves
the auth flow end to end.

Feature screens are scaffolded with placeholders that link to their spec. They are delivered
on their own branches per the [delivery order](./CONTRIBUTING.md#5-recommended-delivery-order):
`feat/design-system` → `feat/services-mock` → `feat/auth` → `feat/dashboard` →
`feat/accounts` → `feat/transactions` → `feat/profile`.

## Engineering notes

(Expanded as features land — architecture decisions, state management, accessibility,
performance, testing, and future improvements per [`specs/README.md`](./specs/README.md).)
