# Eagle Bank: Specifications

This directory is the **single source of truth** for what Eagle Bank does and how it is
built. We practise **spec-driven development (SDD)**: every feature is specified here
_before_ implementation, code is traceable back to a requirement ID, and the specs are
kept in sync as the product evolves.

## How to read these specs

Read in this order. Foundation specs (`0x-*`) establish global rules that every feature
spec inherits and must not contradict.

| #   | Spec                                                 | Purpose                                                                               |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 00  | [Product Constitution](./00-product-constitution.md) | Vision, principles, personas, glossary, Definition of Done. The non-negotiables.      |
| 01  | [Architecture](./01-architecture.md)                 | Tech stack, folder structure, module boundaries, routing, state management.           |
| 02  | [Design System](./02-design-system.md)               | Design tokens + every UI component with props, variants, a11y.                        |
| 03  | [API & Data](./03-api-and-data.md)                   | Domain types, mock data, service-layer contract, endpoint req/res shapes, query keys. |
| 04  | [Testing Strategy](./04-testing-strategy.md)         | Test pyramid, tooling, required coverage, conventions.                                |
| 05  | [Cross-Cutting Concerns](./05-cross-cutting.md)      | Accessibility, performance, error handling, animation, responsiveness, formatting.    |

### Feature specs

Each feature spec is self-contained for delivery and follows the same shape:
**Overview → User Stories → Functional Requirements → Design → API Usage →
Acceptance Criteria → Edge Cases → Tasks → Test Plan.**

| Spec                                                    | Scope                                                   |
| ------------------------------------------------------- | ------------------------------------------------------- |
| [auth.spec.md](./features/auth.spec.md)                 | Login, registration, session, protected routes, logout. |
| [dashboard.spec.md](./features/dashboard.spec.md)       | Overview cards, recent activity, quick actions.         |
| [accounts.spec.md](./features/accounts.spec.md)         | Account list (table/card), search, sort.                |
| [transactions.spec.md](./features/transactions.spec.md) | History, filter, sort, paginate, detail drawer.         |
| [profile.spec.md](./features/profile.spec.md)           | View/edit profile, avatar upload, validation.           |

## Conventions

### Requirement IDs

Every requirement has a stable ID so code, tests, and PRs can reference it:

```
<FEATURE>-<TYPE>-<NUMBER>
```

- `FEATURE`, `AUTH`, `DASH`, `ACCT`, `TXN`, `PROF`, `DS` (design system), `ARCH`, `NFR`.
- `TYPE`, `FR` (functional requirement), `AC` (acceptance criterion), `NFR` (non-functional).
- Example: `AUTH-FR-03`, `TXN-AC-07`, `NFR-A11Y-02`.

Reference them in code comments and commit messages, e.g. `// AUTH-FR-03: lock form during submit`.

### Requirement language (RFC 2119)

- **MUST** / **MUST NOT**: mandatory.
- **SHOULD**: strong recommendation; deviations require justification in the PR.
- **MAY**: optional.

### Acceptance criteria

Written in Gherkin (Given/When/Then). Each maps 1:1 to at least one automated test.

### Status legend

Specs and requirements carry a status: `Draft` · `Approved` · `In Progress` · `Done` · `Deferred`.

## Spec → code traceability

1. A requirement (`AUTH-FR-03`) lives in a feature spec.
2. The acceptance criteria (`AUTH-AC-xx`) describe its observable behaviour.
3. A test asserts the acceptance criterion and is named/commented with the ID.
4. The PR description lists the requirement IDs it satisfies.

No code merges without a corresponding requirement; no requirement is "Done" without a passing test.
