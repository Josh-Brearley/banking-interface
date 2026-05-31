# Contributing & Branching Workflow

Eagle Bank uses **spec-driven development** on a **trunk-based branching model** with
short-lived branches and pull requests. This document is the source of truth for how work
flows from a spec to `main`.

---

## 1. Branching model

```
main ──●────●────────●────────●──────▶   (trunk: always releasable, protected)
        \        \         \
         feat/auth  feat/dashboard  chore/scaffold   (short-lived, one unit of work)
```

- **`main`** — the trunk. Always green (lint + typecheck + tests + build pass). Never commit
  directly; merge only via PR.
- **Working branches** are short-lived (hours–days), cut from the latest `main`, and deleted
  after merge. Keep them small and focused on a single spec/feature.

### Branch naming

```
<type>/<short-kebab-summary>
```

| `type` | Use for | Example |
|--------|---------|---------|
| `feat` | A feature spec (`features/*.spec.md`) | `feat/auth`, `feat/transactions-filtering` |
| `chore` | Tooling, scaffolding, config, deps | `chore/scaffold`, `chore/ci` |
| `fix` | Bug fix | `fix/login-redirect-loop` |
| `docs` | Specs / docs only | `docs/accounts-spec` |
| `refactor` | Behaviour-preserving change | `refactor/data-table` |
| `test` | Tests only | `test/profile-validation` |

Feature branches map 1:1 to a feature spec where possible, so the branch traces to its
requirement IDs (`AUTH-FR-*`, `TXN-AC-*`, …).

Create one with the helper:

```bash
./scripts/new-branch.sh feat auth          # → git switch -c feat/auth (from updated main)
```

---

## 2. Commit convention — [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <subject>

<body — what & why, reference requirement IDs>
```

- **type**: `feat | fix | chore | docs | refactor | test | perf | style | ci`
- **scope** (optional): the feature/area — `auth`, `accounts`, `ui`, `services`…
- Reference spec IDs in the body: `Implements AUTH-FR-03, AUTH-AC-04`.

Examples:

```
feat(auth): add login form with zod validation

Implements AUTH-FR-01..04 and AUTH-AC-01..04.

chore(scaffold): set up vite + tailwind + react query foundation
test(transactions): cover date-range filtering (TXN-AC-03)
```

---

## 3. Definition of Done

A branch is mergeable only when its spec's **Definition of Done**
([00-product-constitution §7](./specs/00-product-constitution.md#7-definition-of-done-per-feature))
is met and:

- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean (no `any`)
- [ ] `npm run test` green (acceptance criteria covered)
- [ ] `npm run build` succeeds
- [ ] PR description lists the requirement IDs delivered

---

## 4. Pull request flow

1. Cut a branch from updated `main` (`./scripts/new-branch.sh <type> <name>`).
2. Implement against the spec; commit in small Conventional Commits.
3. Open a PR using the template; link the spec and list requirement IDs.
4. CI (future) runs lint + typecheck + test + build; review required.
5. **Squash-merge** into `main`; delete the branch.

> Local-only setup: pushing to a remote is optional. The same workflow applies whether or not
> a remote is configured.

---

## 5. Recommended delivery order

Build bottom-up so each branch rests on a stable foundation:

1. `chore/scaffold` — project skeleton (this is the first branch).
2. `feat/design-system` — tokens + UI primitives ([02](./specs/02-design-system.md)).
3. `feat/services-mock` — types, seed data, service layer ([03](./specs/03-api-and-data.md)).
4. `feat/auth` → `feat/dashboard` → `feat/accounts` → `feat/transactions` → `feat/profile`.
5. `chore/ci`, `chore/a11y-perf-audit` — hardening.
