# Eagle Bank

[![CI](https://github.com/Josh-Brearley/banking-interface/actions/workflows/ci.yml/badge.svg)](https://github.com/Josh-Brearley/banking-interface/actions/workflows/ci.yml)

A modern, production-shaped retail banking frontend, built with React, TypeScript and Vite.
The backend is **mocked** with local JSON and a typed service layer; no real backend is
required, but the frontend is written as though one exists (service boundaries, latency,
error handling, caching, and loading states are all production-shaped).

> **Built spec-first and test-first.** Every feature was specified in [`specs/`](./specs/README.md)
> before implementation, and built with **spec-AC-driven TDD** (red → green → refactor),
> landing on `main` through short-lived branches. The full delivery is reflected in the git
> history.

---

## Highlights

- **Five features**: authentication, dashboard, accounts, transactions, profile, each with
  loading, empty, and error states, responsive layouts, and keyboard/screen-reader support.
- **Atomic-Design system** in [`src/components`](./src/components) — `atoms` (Button, Input,
  Select, Card, Table, Modal, Drawer, Avatar, Badge, Skeleton, EmptyState, ErrorState), `molecules`
  (StatCard, MoneyAmount, Pagination…), and `organisms` (DataTable, ErrorBoundary) — driven
  by design tokens and `class-variance-authority`, brand-aligned to the Eagle Bank logo
  (navy + cyan) with self-hosted Inter, and documented in **Storybook** (with an a11y addon).
- **117 tests** across 27 files (Vitest + React Testing Library), each tracing to a spec
  acceptance-criterion ID; **axe-core** WCAG 2.1 A/AA checks run over every route and dialog; a
  **Playwright** smoke suite covers one journey per feature in a real browser.
- **Green gates**: `lint` (zero warnings), `typecheck` (strict, no `any`), `test`, `build`.
- **Route-based code splitting**, URL-driven list state, and TanStack Query caching.

## Quick start

```bash
nvm use            # Node 20+
npm install
npm run dev        # http://localhost:5173
```

**Demo login:** `demo@eaglebank.com` / `Password123!`

### Scripts

| Script                                     | Description                         |
| ------------------------------------------ | ----------------------------------- |
| `npm run dev`                              | Vite dev server.                    |
| `npm run build`                            | Type-check + production build.      |
| `npm run preview`                          | Preview the production build.       |
| `npm run typecheck`                        | `tsc --noEmit` (strict).            |
| `npm run lint`                             | ESLint, **zero warnings allowed**.  |
| `npm run test` / `test:watch` / `test:cov` | Vitest.                             |
| `npm run test:e2e`                         | Playwright E2E (builds + previews). |
| `npm run format`                           | Prettier.                           |
| `npm run storybook`                        | Storybook dev server (port 6006).   |
| `npm run build-storybook`                  | Build the static Storybook.         |
| `npm run lighthouse`                       | Lighthouse CI against the build.    |

## Tech stack

React 18 · TypeScript (strict) · Vite · React Router v6 · TanStack Query v5 · Tailwind CSS ·
class-variance-authority · React Hook Form · Zod · Vitest · React Testing Library · MSW-ready.
Self-hosted **Inter** via `@fontsource-variable/inter`. Utilities: `clsx` + `tailwind-merge`,
`date-fns`.

---

## Architecture decisions

### Why feature-first

The app is organised by **feature/domain**, not by file type. Each feature in
[`src/features`](./src/features) (`auth`, `dashboard`, `accounts`, `transactions`, `profile`)
owns its pages, components, hooks, and schemas, and exposes a **barrel `index.ts`** as its only
public surface.

```
src/
├── app/          # composition root: router, providers, layouts
├── features/     # one self-contained folder per domain (barrel-exported)
├── components/   # Atomic Design (zero feature knowledge)
│   ├── atoms/        # primitives: Button, Input, Card, Modal, Drawer, Badge…
│   ├── molecules/    # small composites: StatCard, MoneyAmount, Pagination…
│   └── organisms/    # complex widgets: DataTable, ErrorBoundary
├── lib/          # framework-agnostic: api (mock client + query keys), auth, utils
├── hooks/        # cross-feature hooks (useMediaQuery, useDebouncedValue, useFocusTrap)
├── services/     # mocked backend (*.service.ts), latency + ApiError simulation
├── data/         # seed JSON
├── types/        # shared domain types
└── tests/        # setup, render helpers, fixtures
```

**Why:** this scales to multiple teams and products, keeps features independently ownable and
removable, and is the natural seam for future **micro-frontends**. The rationale and the full
component/token catalogue live in [`specs/01-architecture.md`](./specs/01-architecture.md) and
[`specs/02-design-system.md`](./specs/02-design-system.md).

### Module boundaries

Boundaries are explicit (see [architecture §3](./specs/01-architecture.md#3-module-boundary-rules-arch-nfr-02)):
features never import each other's internals; `components/*` (atoms/molecules/organisms) know
nothing about features or services; `services` are pure async functions with no React. Cross-feature communication happens
via shared services, the URL, or shared context, never by reaching into another feature's folder.
This keeps the dependency graph acyclic and the blast radius of any change small.

### Type safety end-to-end

`strict` TypeScript with `noUncheckedIndexedAccess`; **`no-explicit-any` is a lint error**.
External/form data is validated at the boundary with **Zod**, and a single Zod schema is the
source of both the runtime check and the inferred TS type. Money is stored as **integer minor
units** (pennies) and only formatted at the view edge, no floating-point arithmetic on currency.

---

## State management

State is deliberately split by ownership rather than dumped into one global store:

| State kind                     | Owner                                                | Why                                                 |
| ------------------------------ | ---------------------------------------------------- | --------------------------------------------------- |
| **Server / async**             | **TanStack Query**                                   | accounts, transactions, dashboard summary, profile. |
| **Auth / session**             | `AuthProvider` (context) + LocalStorage + `/auth/me` | small, app-wide identity.                           |
| **Form**                       | React Hook Form + Zod                                | performant uncontrolled inputs, schema validation.  |
| **List filters / sort / page** | **URL search params**                                | shareable, survives refresh & back/forward.         |
| **Ephemeral UI**               | local `useState`                                     | modal/drawer open, selected row.                    |

### Why TanStack Query (not Redux)

The vast majority of this app's state is **server state**: remote data that is fetched, cached,
and can go stale. TanStack Query is purpose-built for exactly that: caching, request
deduplication, background refetch, retries with a 4xx-aware policy, and `keepPreviousData` for
flicker-free pagination/sorting. Modelling that with a general-purpose client store (Redux) would
mean hand-rolling caching, loading/error tracking, and invalidation, re-implementing the library
poorly. So **server state lives in Query; client state stays local**. We never copy server data
into `useState`; components read it from the query cache. A typed, hierarchical
[query-key factory](./src/lib/api/queryKeys.ts) keeps keys consistent and makes invalidation
precise (e.g. a profile update invalidates `auth.me` and updates the `AuthProvider` so the
dashboard greeting changes immediately).

There is no Redux and no global client store: the only cross-cutting client state (auth) is a
small, typed context.

### URL as state

Accounts and transactions keep **search, filters, sort, and page in the URL**. This makes views
shareable and deep-linkable, makes browser back/forward "just work", and means the query key
derives directly from the URL, one source of truth for what's on screen.

### Mock API / service layer

Each [`*.service.ts`](./src/services) simulates a backend: random latency, a typed `ApiError`
model with field errors for 422s, and forced-error hooks so error states are demoable and
testable. React Query's retry policy is 4xx-aware (client errors aren't retried). The service
signatures model the real REST contract (pagination, filter params), so swapping in a real API
later is a change behind the service boundary, not a rewrite. See
[`specs/03-api-and-data.md`](./specs/03-api-and-data.md).

---

## Design system

A token-driven, accessibility-first system (the full catalogue is
[`specs/02-design-system.md`](./specs/02-design-system.md)):

- **Tokens** are the contract, semantic colours, a spacing scale, a typographic ramp, radii,
  shadows, z-index, and motion durations, defined as CSS variables in
  [`src/styles/index.css`](./src/styles/index.css) and surfaced through the Tailwind theme.
  Components reference tokens, never raw hex/px.
- **Brand**: primary **navy** `#0B2A5B` and secondary **cyan** `#18A8E0`, pulled from the eagle
  logo. Cyan is documented as an **accent only** (it fails AA as small text), so navy carries all
  text, links, and focus, an accessibility constraint baked into the tokens.
- **Variants** use **class-variance-authority** for type-safe, self-documenting component APIs;
  classes compose via a `cn()` helper (`clsx` + `tailwind-merge`).
- **Typeface**: Inter (variable), self-hosted (no external request).
- **Storybook** (`npm run storybook`) is the living catalogue — atoms and molecules each have
  stories with autodocs, plus a **Foundations/Tokens** page showing the colour palette and type
  ramp. The **`@storybook/addon-a11y`** runs axe-core in the canvas so violations surface while
  building components, complementing the route-level axe checks in the test suite.

---

## Accessibility

Accessibility is treated as a feature, not a polish step (target: Lighthouse a11y ≥ 90). Concrete
decisions:

- **Semantic HTML first**: real `button`/`a`/`input`/`table`/`nav`; ARIA only where native
  semantics fall short.
- **Keyboard & focus**: visible `:focus-visible` ring on every interactive element; a global
  **skip-to-content** link; route changes move focus to `main`. The **Modal/Drawer** use a custom
  [`useFocusTrap`](./src/hooks/useFocusTrap.ts): focus moves in on open, is trapped on Tab,
  `Esc` closes, and focus is **restored to the trigger** on close.
- **Forms**: every input has an associated `<label>`; errors are linked via `aria-describedby`
  and the field is marked `aria-invalid`; invalid submits surface errors and **focus the first
  invalid field**. (We deliberately gate Save on _dirty_ rather than hard-disabling on _invalid_,
  because disabling submit-on-invalid prevents that error feedback, a documented decision in the
  [profile spec](./specs/features/profile.spec.md).)
- **Colour is never the only signal**: money direction is shown with a `+`/`−` sign and an icon,
  not colour alone; status uses a textual badge, not just a hue. All pairings target WCAG AA.
- **Async is announced**: loading regions use `role="status"`/`aria-busy`; error states use
  `role="alert"`.
- **Reduced motion**: all animation is gated behind `prefers-reduced-motion`.
- **Sortable tables** expose `aria-sort`; pagination is a labelled `nav`.

The full a11y checklist is [`specs/05-cross-cutting.md §1`](./specs/05-cross-cutting.md#1-accessibility-nfr-a11y--target-lighthouse-a11y--90).
A committed **real-browser Lighthouse run scores accessibility 100** (including `color-contrast`,
which jsdom can't check) — see [`docs/lighthouse/`](./docs/lighthouse/README.md).

## Performance

Target: Lighthouse performance ≥ 90.

- **Route-based code splitting**: every page is `React.lazy` + `Suspense`, so each route is its
  own chunk (visible in the build output); auth (React Hook Form + Zod) and the data pages load
  off the critical path.
- **Efficient caching**: sensible `staleTime`, `keepPreviousData`/`placeholderData` for paginated
  and re-sorted lists (no flash to empty), and query-key hygiene so each filter/sort/page combo is
  cached independently.
- **Fewer re-renders**: state is colocated and lifted only when shared; search inputs are
  **debounced** before hitting the URL/query; no prop-drilling beyond one level.
- **Skeletons over spinners** for perceived performance, with reserved layout to avoid shift.
- **Bundle hygiene**: tree-shakeable imports (`date-fns`, individual icons), self-hosted font,
  and a one-off [trim script](./scripts/trim-logo.mjs) that cropped the logo asset from 1.2 MB to
  164 KB (it doubles as the favicon).
- **Lighthouse CI** (`npm run lighthouse`, also a [CI job](./.github/workflows/ci.yml)) audits the
  production build against budgets in [`lighthouserc.json`](./lighthouserc.json): accessibility is a
  hard gate (≥ 0.9) and performance/best-practices/SEO are tracked as warnings, with reports
  uploaded to temporary public storage. A committed local run of the static build scores **100
  accessibility / 100 best-practices / 100 SEO** and **88–94 performance** (lab figure on an
  uncompressed static preview with no CDN; a real deployment with compression typically scores
  higher). The report is checked in at [`docs/lighthouse/`](./docs/lighthouse/README.md).

Details in [`specs/05-cross-cutting.md §2`](./specs/05-cross-cutting.md#2-performance-nfr-perf--target-lighthouse-perf--90).

## Testing

We practise **spec-AC-driven TDD**: each acceptance criterion becomes a failing test first, then
the minimum code to pass, then refactor (the workflow is in [`CLAUDE.md`](./CLAUDE.md#tdd-workflow)).
Tests assert **user-observable behaviour** (queried by role/label/text, accessibility-first), not
implementation details, and each cites its requirement ID.

- **117 tests** across 27 files (Vitest + React Testing Library + `user-event`), with a custom
  [`renderWithProviders`](./src/tests/renderWithProviders.tsx) and typed
  [fixtures](./src/tests/fixtures/index.ts).
- **Every data view** has loading, empty, and error/retry coverage, not just the happy path.
- The required assessment coverage is met and exceeded: login/registration validation, protected
  routes, profile validation + successful update, and transaction filtering/sorting, plus
  pagination, the focus-trapped detail drawer, the responsive table↔card switch (tested at both
  viewports by controlling `matchMedia`), and design-system primitives.
- **Playwright E2E smoke** ([`e2e/`](./e2e), `npm run test:e2e`) runs one happy path per feature in
  a real browser against the production build — proving lazy route chunks load, the session
  persists in real `localStorage`, and each feature renders end-to-end (what jsdom can't cover).

Strategy and conventions: [`specs/04-testing-strategy.md`](./specs/04-testing-strategy.md).

---

## How this was built: spec-driven, trunk-based

- **Specs are the source of truth.** Requirements carry stable IDs (`AUTH-FR-03`, `TXN-AC-05`);
  code and tests trace back to them. Index: [`specs/README.md`](./specs/README.md).
- **Trunk-based branching.** `main` stays releasable; work happens on short-lived
  `feat/`·`fix/`·`chore/`·`docs/` branches, squash/`--no-ff` merged after the gates pass. The
  workflow and commit conventions are in [`CONTRIBUTING.md`](./CONTRIBUTING.md); a
  [helper script](./scripts/new-branch.sh) enforces naming.
- When a spec proved internally inconsistent during implementation (the profile Save-gating case),
  the spec was **updated to record the decision and rationale** rather than silently diverging.

## Future improvements

In a real production banking environment, next steps would include:

- **Real API integration**: swap the mock services for a real client behind the existing service
  boundary; add auth-token refresh, request cancellation, and optimistic updates for transfers.
- **CI/CD**: GitHub Actions already run `lint · typecheck · test (coverage) · build` plus
  Lighthouse budgets on every PR; next would be per-PR preview deployments and a published
  Storybook.
- **E2E tests**: the Playwright smoke suite covers one journey per feature; next would be deeper
  flows (a full transfer), cross-browser projects (WebKit/Firefox), and visual regression on the
  design system.
- **Observability**: error monitoring (e.g. Sentry) wired into the `ErrorBoundary`, plus RUM/
  performance and structured logging.
- **Feature flags & analytics**: a typed flag client (the config seam already exists) for safe
  rollout, and privacy-conscious product analytics.
- **Design-system package extraction**: promote `components/atoms` + tokens into a versioned
  package (with visual-regression tests on top of the existing Storybook) shared across products/teams.
- **Security & compliance**: real auth (httpOnly cookies/OIDC), CSP, dependency scanning, and the
  controls a regulated banking app requires.
- **Internationalisation**: the formatting layer is already locale-driven (`Intl`); add message
  catalogues and RTL support.

---

## Project map

```
specs/        product constitution, architecture, design system, API/data, testing, NFRs, feature specs
src/app/      router (lazy routes), providers (Query + Auth + ErrorBoundary), layouts
src/features/ auth · dashboard · accounts · transactions · profile
src/components atoms (primitives) · molecules (StatCard, MoneyAmount, Pagination…) · organisms (DataTable, ErrorBoundary)
src/lib/      api (mock client, query keys) · auth (session) · utils (cn, money/date format)
src/services/ mocked backend with latency + ApiError simulation
```

See [`CLAUDE.md`](./CLAUDE.md) for contributor conventions and [`specs/`](./specs/README.md) for
the full specifications.
