# CLAUDE.md

Guidance for working in this repository. Read this before making changes.

Eagle Bank is a **spec-driven**, **test-driven** banking frontend. The backend is mocked
(local JSON + a service layer). Specs are the source of truth; tests prove the specs.

## Golden rules

1. **Spec first.** Every change traces to a requirement ID in [`specs/`](./specs/README.md)
   (e.g. `AUTH-FR-03`, `TXN-AC-05`). No requirement → write/adjust the spec first.
2. **Test first (TDD).** Follow Red → Green → Refactor. See [Workflow](#tdd-workflow).
3. **Trunk-based branching.** Never commit to `main` directly; work on a short-lived branch
   and merge. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).
4. **Respect module boundaries.** Features never import each other's internals. See
   [`specs/01-architecture.md`](./specs/01-architecture.md#3-module-boundary-rules-arch-nfr-02).
5. **Every state has a UI** — loading, empty, error, success. "Happy path only" is incomplete.
6. **Accessibility is non-negotiable** — semantic HTML, keyboard, focus, ARIA, AA contrast.
7. **No `any`** (lint error). Validate external/runtime data with Zod at the boundary.

## TDD workflow

We practise **spec-AC-driven TDD**: acceptance criteria become tests _before_ implementation.

```
1. Pick the next acceptance criterion   e.g. AUTH-AC-04 (login rejects bad credentials)
2. RED    Write a test that asserts that behaviour. Name/comment it with the ID. Run it; it fails.
3. GREEN  Write the minimum code to make it pass. Run the test; it passes.
4. REFACTOR  Clean up (names, dupes, extraction) with tests staying green.
5. Repeat for the next AC. Commit in small Conventional Commits.
```

Guidelines:

- **Lead with the test.** For a new component/hook/service function, the first edit in the
  change is its test file. The test encodes the spec's expected behaviour.
- **Test behaviour, not implementation.** Query by role/label/text (a11y-first). Don't assert
  internal state, class names, or call counts. (`specs/04-testing-strategy.md`)
- **Cover every branch of state.** Each data view needs a loading test, an empty test, and an
  error/retry test — not just success.
- **One reason to change per test.** Small, focused `it()` blocks; the name states the behaviour.
- **Pragmatic, not dogmatic.** Pure logic and behaviour-bearing components are always
  test-first. Trivial purely-presentational wrappers (e.g. a styled `<div>`) may ship with a
  light render/a11y test rather than exhaustive cases. When in doubt, write the test.
- **A requirement is not "Done" until its AC has a passing test** (Definition of Done,
  `specs/00-product-constitution.md §7`).

### Example (Red first)

```tsx
// LoginForm.test.tsx — AUTH-AC-04
it("shows an accessible error when credentials are rejected", async () => {
  server.use(rejectLoginHandler); // 401
  renderWithProviders(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
  await userEvent.type(screen.getByLabelText(/password/i), "wrong");
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
  expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect/i);
});
// ...then implement LoginForm until this passes.
```

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run test:watch   # TDD loop — keep this running
npm run test         # full suite (CI mode)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint, zero warnings allowed
npm run build        # typecheck + production build
```

Quality gates that must pass before merge: `lint`, `typecheck`, `test`, `build`.

## Project map

```
src/
  app/         router, providers, layouts (composition root)
  features/    auth, dashboard, accounts, transactions, profile — self-contained, barrel-exported
  components/  ui (design system primitives) + shared (composed widgets)
  lib/         api (mock client + query keys), auth (session), utils (cn, format)
  hooks/       cross-feature hooks
  services/    mocked backend (*.service.ts) — latency + ApiError simulation
  data/        seed JSON
  types/       shared domain types (Money is integer minor units)
  tests/       setup, renderWithProviders, fixtures
```

Key conventions:

- **Money** is stored as integer **minor units**; format only at the view edge with
  `formatMoney` (`lib/utils`). Never do float math on currency.
- **Server state** lives in TanStack Query; **list filters/sort/page** live in the URL;
  **forms** use React Hook Form + Zod. Never copy server data into local state.
- **Query keys** come from the factory in `lib/api/queryKeys.ts`.
- **Design-system primitives** use `class-variance-authority`; compose classes with `cn()`.
- New page? It must be **lazy-loaded** in `app/router/router.tsx`.

## Branching quick reference

```bash
./scripts/new-branch.sh feat design-system   # cut a branch from updated main
# ...TDD commits...
git switch main && git merge --no-ff feat/design-system   # land it
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for naming, commit format, and the PR checklist.
