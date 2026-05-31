# 01 — Architecture

> Status: Approved · Inherits: [00-product-constitution](./00-product-constitution.md)

---

## 1. Technology stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| UI library | **React 18** | Concurrent features, ecosystem, team familiarity. |
| Language | **TypeScript** (`strict`) | Type safety end-to-end (`ARCH-NFR-03`). |
| Build/dev | **Vite** | Fast HMR, native ESM, simple code-splitting. |
| Routing | **React Router v6** (data router) | Nested layouts, lazy routes, loaders if needed. |
| Server state | **TanStack Query v5** | Caching, dedupe, retry, background refetch — production-shaped async. |
| Styling | **Tailwind CSS** | Token-driven utility styling, small CSS, fast iteration. |
| Component variants | **class-variance-authority (CVA)** | Type-safe variant API for the design system. |
| Forms | **React Hook Form** | Performant uncontrolled forms, minimal re-renders. |
| Validation | **Zod** | Single schema → TS types + runtime validation at boundaries. |
| Animation | **Framer Motion** | Declarative, accessible, `prefers-reduced-motion` aware. |
| Testing | **Vitest + React Testing Library** | Vite-native, fast, user-centric assertions. |
| Mock network (optional) | **MSW** | Intercept at network layer for realistic tests/dev. |
| Component docs (optional) | **Storybook** | Isolated design-system development. |

Utility libs: `clsx` + `tailwind-merge` (class composition), `date-fns` (date math, tree-shakeable).

---

## 2. Folder structure

```
src/
├── app/
│   ├── router/          # route tree, lazy route definitions, route guards
│   ├── providers/       # QueryClientProvider, AuthProvider, composed AppProviders
│   └── layouts/         # RootLayout, AuthLayout, AppShell (nav + outlet)
│
├── features/            # one folder per domain; self-contained
│   ├── auth/
│   │   ├── components/  # LoginForm, RegisterForm
│   │   ├── hooks/       # useLogin, useRegister, useLogout
│   │   ├── pages/       # LoginPage, RegisterPage
│   │   ├── schemas/     # zod schemas for this feature
│   │   └── index.ts     # public surface (barrel) — the ONLY import entry
│   ├── dashboard/
│   ├── accounts/
│   ├── transactions/
│   └── profile/
│
├── components/
│   ├── ui/              # design system primitives (Button, Input, …)
│   └── shared/          # composed app widgets (PageHeader, StatCard, DataTable…)
│
├── lib/
│   ├── api/             # http client shim, latency/error simulation, ApiError
│   ├── auth/            # token storage, session persistence helpers
│   ├── validation/      # shared zod helpers, resolvers
│   └── utils/           # cn(), formatMoney(), formatDate(), pagination helpers
│
├── hooks/               # cross-feature reusable hooks (useMediaQuery, useDebounce…)
├── services/            # mock backend: *.service.ts (auth, dashboard, accounts…)
├── data/                # seed JSON: users, accounts, transactions
├── types/               # shared domain types (User, Account, Transaction, Money…)
├── tests/               # test setup, render helpers, fixtures, MSW handlers
└── assets/              # static assets, icons
```

### Folder responsibilities

- **`features/*`** own pages, feature components, feature hooks, and feature schemas. They
  consume design-system primitives and services. They expose a **barrel `index.ts`** —
  the only thing other modules may import.
- **`components/ui`** is the design system (`02-design-system`). Zero feature knowledge.
- **`components/shared`** are reusable, feature-agnostic compositions of `ui` primitives.
- **`services/*`** are the mock API. Pure async functions returning typed domain data.
- **`lib/*`** is framework-agnostic plumbing. No JSX in `lib/api`, `lib/auth`, `lib/utils`.

---

## 3. Module boundary rules (`ARCH-NFR-02`)

These are enforced by convention (and `SHOULD` be enforced by ESLint `import/no-restricted-paths`):

| Layer | May import from | MUST NOT import from |
|-------|-----------------|----------------------|
| `features/X` | `components/*`, `lib/*`, `hooks/*`, `services/*`, `types/*` | `features/Y` internals, `app/*` |
| `components/ui` | `lib/utils`, `types` | any `feature`, any `service`, `app/*` |
| `components/shared` | `components/ui`, `lib/*`, `types` | any `feature`, any `service` |
| `services/*` | `lib/api`, `lib/auth`, `data/*`, `types` | any `feature`, any `component`, React |
| `lib/*` | other `lib/*`, `types` | `features`, `components`, `services`, `app` |
| `app/*` | everything (composition root) | — |

Cross-feature communication happens via shared services, the URL, or shared context — never
by reaching into another feature's folder.

---

## 4. Routing & code splitting (`ARCH-NFR-09`)

React Router data router. **Every page component is `React.lazy` + `Suspense`** so each
route is its own chunk.

```
/                       → redirect to /dashboard (if authed) or /login
AuthLayout (public)
  /login                → LoginPage           [lazy]
  /register             → RegisterPage        [lazy]
AppShell (protected — ProtectedRoute guard)
  /dashboard            → DashboardPage        [lazy]
  /accounts             → AccountsPage         [lazy]
  /transactions         → TransactionsPage     [lazy]
  /profile              → ProfilePage          [lazy]
*                       → NotFoundPage         [lazy]
```

- **`ProtectedRoute`** wraps the `AppShell`. If unauthenticated → `Navigate` to `/login`
  preserving intended path (`?from=`). See [auth.spec](./features/auth.spec.md).
- **`AuthLayout`** redirects already-authenticated users away from `/login` & `/register`.
- Each `Suspense` fallback is a route-appropriate **skeleton**, not a spinner.
- An **ErrorBoundary** wraps the router root (app-level fallback) and SHOULD wrap each
  route element (so one page crashing doesn't blank the shell). See [05-cross-cutting](./05-cross-cutting.md).

---

## 5. State management strategy (`ARCH-NFR-04`)

| State kind | Owner | Examples |
|------------|-------|----------|
| **Server/async state** | TanStack Query | accounts, transactions, dashboard summary, current user. |
| **Auth/session state** | `AuthProvider` (context) backed by LocalStorage + Query (`/auth/me`). | token, current user identity. |
| **Form state** | React Hook Form (local to form). | login, register, profile edit. |
| **Ephemeral UI state** | `useState`/`useReducer` local; context only if shared. | modal open, drawer open, selected row, search input (debounced). |
| **URL state** | React Router search params. | filters, sort, page, search query on list pages. |

**Rules:**
- Never copy server data into `useState`. Read it from the query cache.
- List filters/sort/pagination live in the **URL** so views are shareable and back/forward works.
- Global client state is avoided; if needed it is a small, typed context — no Redux.

### React Query configuration baseline

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,            // 30s — money data is sensitive to staleness
      gcTime: 5 * 60_000,
      retry: 2,                     // ApiError 4xx → no retry (see lib/api)
      refetchOnWindowFocus: true,
      throwOnError: false,          // render error states, not the boundary, for data
    },
    mutations: { retry: 0 },
  },
});
```

Query key conventions live in [03-api-and-data](./03-api-and-data.md#6-react-query-keys).

---

## 6. Providers composition

`AppProviders` composes, outer → inner:

```
<ErrorBoundary>
  <QueryClientProvider>
    <AuthProvider>          // hydrates session from LocalStorage, exposes useAuth()
      <RouterProvider />     // also: <ReactQueryDevtools> in dev only
    </AuthProvider>
  </QueryClientProvider>
</ErrorBoundary>
```

---

## 7. Conventions

- **Naming:** Components `PascalCase.tsx`; hooks `useThing.ts`; services `thing.service.ts`;
  schemas `thing.schema.ts`; tests `*.test.ts(x)` colocated or in `tests/`.
- **Barrels:** every `feature` exposes `index.ts`. Deep imports across features are forbidden.
- **Path aliases:** `@/` → `src/`. Configure in `vite.config.ts` + `tsconfig` paths.
- **No `any`:** lint error. Use `unknown` + Zod narrowing at boundaries.
- **`cn()` helper:** `clsx` + `tailwind-merge` for conditional class composition.
- **Money:** never `number` arithmetic on formatted strings; operate on minor units, format at edge.

---

## 8. Environment & config

- No secrets (mock app). A `src/config/env.ts` reads `import.meta.env` with a Zod schema so
  any future real config is validated at startup.
- Feature flags: a simple typed `featureFlags` object in config (future: remote-driven).
  See [Future Improvements in README](../README.md).
