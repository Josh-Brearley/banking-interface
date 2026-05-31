# 02 — Design System

> Status: Approved · Inherits: [00](./00-product-constitution.md), [01](./01-architecture.md)
> Location: `src/components/ui/`

A lightweight, token-driven, accessibility-first design system. Visual tone: clean,
professional, trustworthy, minimal (Monzo / Chase UK / modern Barclays). All variants use
**class-variance-authority** so they are type-safe and self-documenting.

---

## 1. Design tokens

Tokens are the contract. Components reference tokens, never raw hex/px. Implemented as CSS
variables + Tailwind theme extension so theming (incl. future dark mode) is a token swap.

### 1.1 Colour — semantic system (`DS-FR-01`)

Define a primitive palette, then map **semantic** tokens. Components use semantic tokens only.

| Semantic token | Light value (ref) | Usage |
|----------------|-------------------|-------|
| `--color-background` | `#FBFBFD` | App canvas. |
| `--color-surface` | `#FFFFFF` | Cards, modals, surfaces. |
| `--color-surface-muted` | `#F4F5F7` | Subtle fills, skeleton base, table header. |
| `--color-border` | `#E6E8EC` | Hairline borders, dividers. |
| `--color-foreground` | `#0B0D12` | Primary text. |
| `--color-foreground-muted` | `#5B6472` | Secondary text, captions. |
| `--color-primary` | `#0B2A5B` | Brand **navy** — primary buttons, links, active states, focus. From the logo. |
| `--color-primary-foreground` | `#FFFFFF` | Text on primary. |
| `--color-secondary` | `#18A8E0` | Brand **cyan** accent — active indicators, highlights, decorative fills. From the logo. |
| `--color-secondary-foreground` | `#FFFFFF` | Text on cyan (large/decorative only — cyan fails AA for small text, so it is not used as a text colour). |
| `--color-secondary-subtle` | `#E0F4FC` | Light cyan background for accents/badges (pair with navy text). |
| `--color-success` | `#0E8A52` | Deposits/credits, positive. |
| `--color-warning` | `#B26A00` | Pending, attention. |
| `--color-danger` | `#C62330` | Withdrawals/errors, destructive. |
| `--color-info` | `#1577B8` | Informational. |
| `--color-ring` | `#0B2A5B` | Focus ring (navy — high contrast on the light canvas). |

Status colours have a `-subtle` background pair (e.g. `--color-success-subtle`) for badges; the
brand cyan has `--color-secondary-subtle`.

**Brand:** primary is the navy from the Eagle Bank eagle; secondary is the cyan wing
highlight. Navy carries actions/links/focus; cyan is an **accent only** (it does not meet AA
as small text on light, so never use it for body/link text).

**Typeface:** **Inter** (variable), self-hosted via `@fontsource-variable/inter`, loaded in
`main.tsx`. Falls back to the system sans stack.

**Contrast (`NFR-A11Y`):** every foreground/background pairing MUST meet **WCAG AA**
(4.5:1 body text, 3:1 large text & UI components). Semantic money colours (success/danger)
MUST be paired with an icon or sign (`+`/`−`), never colour alone.

### 1.2 Spacing scale (`DS-FR-02`)

4px base. Use scale steps only: `0, 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40),
12(48), 16(64)`. (Tailwind default spacing aligns; do not use arbitrary `px`.)

### 1.3 Typography scale (`DS-FR-03`)

Sans system stack (e.g. `Inter`, fallback system-ui). Type ramp:

| Token | Size / line-height | Weight | Use |
|-------|--------------------|--------|-----|
| `display` | 36 / 40 | 700 | Balance hero. |
| `h1` | 28 / 34 | 700 | Page titles. |
| `h2` | 22 / 28 | 600 | Section titles. |
| `h3` | 18 / 24 | 600 | Card titles. |
| `body` | 15 / 22 | 400 | Default text. |
| `body-sm` | 13 / 18 | 400 | Secondary. |
| `caption` | 12 / 16 | 500 | Labels, meta. |
| `mono` | 14 / 20 | 500 | Account numbers, amounts (tabular-nums). |

Money values use `font-variant-numeric: tabular-nums`.

### 1.4 Radius / shadow / z-index / motion

- **Radius:** `sm 6 · md 10 · lg 14 · full 9999`. Cards `lg`, inputs/buttons `md`.
- **Shadow:** `xs` (hairline), `sm` (cards), `md` (popovers), `lg` (modals). Subtle only.
- **z-index:** `dropdown 1000 · sticky 1100 · drawer 1200 · modal 1300 · toast 1400`.
- **Motion:** `fast 120ms · base 200ms · slow 320ms`; easing `ease-out` (enter), `ease-in`
  (exit). All motion gated by `prefers-reduced-motion` (`ARCH-NFR-10`).

---

## 2. Global a11y rules for every component (`DS-FR-04`)

- Keyboard operable; visible focus via `:focus-visible` ring using `--color-ring` (never `outline: none` without replacement).
- Interactive elements are real semantic elements (`button`, `a`, `input`) or have correct `role` + key handlers.
- Min hit target 44×44px on touch.
- Labels associated (`htmlFor`/`id`); errors linked via `aria-describedby`; invalid fields `aria-invalid`.
- Components forward `ref` and spread valid native props (`...rest`).

---

## 3. Component specifications

Each component lists: variants (CVA), props, behaviour, a11y. All accept `className`
(merged via `cn()`) and forward refs.

### 3.1 Button — `DS-FR-10`

```ts
// cva
variant:  primary | secondary | outline | ghost | destructive | link
size:     sm | md | lg | icon
fullWidth: boolean
```

| Prop | Type | Notes |
|------|------|-------|
| `variant` | above | default `primary` |
| `size` | above | default `md` |
| `isLoading` | `boolean` | shows spinner, sets `aria-busy`, disables interaction |
| `leftIcon`/`rightIcon` | `ReactNode` | decorative → `aria-hidden` |
| `asChild` | `boolean` | render as child (e.g. router `Link`) via Slot pattern |
| `disabled` | `boolean` | |
| `...rest` | `ButtonHTMLAttributes` | `type="button"` default |

**Behaviour:** when `isLoading`, content stays for width stability, spinner overlays,
`disabled` + `aria-busy="true"`. **A11y:** icon-only buttons MUST have `aria-label`.

### 3.2 Input — `DS-FR-11`

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | rendered `<label>`; required for a11y |
| `hint` | `string?` | helper text, linked via `aria-describedby` |
| `error` | `string?` | error text; sets `aria-invalid`, links via `aria-describedby` |
| `leftAddon`/`rightAddon` | `ReactNode?` | e.g. `£`, visibility toggle |
| `id` | auto-generated via `useId` if absent | |
| `...rest` | `InputHTMLAttributes` | |

States: default, focus, error, disabled. Password variant exposes a show/hide toggle button
(`aria-pressed`, `aria-label`). Never rely on placeholder as label.

### 3.3 Select — `DS-FR-12`

Native `<select>` styled (most accessible default) OR a headless listbox if rich content is
needed. Spec'd as native: `label`, `hint`, `error`, `options: {label,value}[]`,
`placeholder`. Same label/error wiring as Input. If a custom listbox is built it MUST
implement `role="listbox"`, arrow-key navigation, `aria-activedescendant`, and type-ahead.

### 3.4 Card — `DS-FR-13`

Composable: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
`CardFooter`. Surface bg, `lg` radius, `sm` shadow, `border`. `interactive` variant adds
hover elevation + pointer; if interactive it MUST be a `button`/`a` or have appropriate role.

### 3.5 Table — `DS-FR-14`

Semantic `<table>` with `<caption>` (visually-hidden ok), `<thead>`, `scope="col"` headers,
`<tbody>`. Props: `columns: Column<T>[]` (`{ header, accessor, sortable?, align?, cell? }`),
`data: T[]`, `sort`, `onSortChange`, `getRowId`, `onRowClick?`, `isLoading`, `emptyState`.
- Sortable headers render a `<button>` with `aria-sort` (`none|ascending|descending`).
- Loading → renders Skeleton rows. Empty → renders `EmptyState`.
- Row click MUST also be keyboard reachable (row action button or roving focus). Used in
  table/card responsive pattern (see `DataTable` in `components/shared`).

### 3.6 Modal (Dialog) — `DS-FR-15`

Built on a focus-trap dialog (Radix Dialog or hand-rolled).
- `role="dialog"` + `aria-modal="true"`, `aria-labelledby` (title) + `aria-describedby`.
- **Focus trap**; focus moves to dialog on open, returns to trigger on close.
- `Esc` closes; click on overlay closes (configurable); background `inert`/scroll-locked.
- Framer Motion fade+scale (respects reduced motion). Variants: `sm|md|lg`.

### 3.7 Drawer — `DS-FR-16`

Side sheet variant of Modal (slides from right; bottom-sheet on mobile). Same a11y contract
as Modal. Used by the transaction detail view.

### 3.8 Avatar — `DS-FR-17`

`src?`, `name` (for initials fallback + `alt`), `size: sm|md|lg`. Falls back to initials on
missing/broken image (`onError`). Decorative-only avatars get `alt=""`; identifying ones get
the person's name as `alt`.

### 3.9 Badge — `DS-FR-18`

`variant: neutral | success | warning | danger | info`, `size: sm|md`. Used for account
`status` and transaction `type`. MUST include text (not colour-only). Optional leading dot/icon.

### 3.10 Skeleton — `DS-FR-19`

`SkeletonLine`, `SkeletonCircle`, `SkeletonCard`, plus composed `Skeleton.Table` /
`Skeleton.StatCard`. Subtle shimmer (reduced-motion → static). Decorative →
`aria-hidden="true"`; container exposes `aria-busy="true"` / `role="status"` with SR text
"Loading …".

### 3.11 EmptyState — `DS-FR-20`

`icon`, `title`, `description`, optional `action` (Button). Centered, calm. Used when a
query succeeds with zero results. Provides guidance, not just "No data".

### 3.12 ErrorState — `DS-FR-21`

`title`, `description`, `onRetry?`, `error?`. Renders a retry Button wired to React Query
`refetch`. Friendly, non-technical copy; never dumps stack traces to users. `role="alert"`.

### 3.13 Supporting primitives

`Spinner` (SR-labelled), `Label`, `FormError` (`role="alert"`), `VisuallyHidden`,
`IconButton` (Button `size=icon` with required `aria-label`), `Toast`/notifications
(optional, `aria-live="polite"`).

---

## 4. Composed shared widgets (`components/shared`)

Built from primitives, feature-agnostic, reused across features:

- **`PageHeader`** — title, subtitle, actions slot.
- **`StatCard`** — label, value (money), delta, icon; used on dashboard.
- **`DataTable<T>`** — Table on desktop, Card list on mobile (via `useMediaQuery`); wires
  sort + loading + empty + error. Backbone of Accounts & Transactions.
- **`SearchInput`** — debounced input, clear button, `role="searchbox"`.
- **`MoneyAmount`** — formats minor units; colours + signs by direction; `tabular-nums`.
- **`Pagination`** — accessible page controls (`aria-label`, current `aria-current`).

---

## 5. Tailwind & CVA conventions

- Theme extends from CSS variables so tokens are the single source.
- `cn()` (`clsx` + `tailwind-merge`) composes classes and resolves conflicts.
- One `cva()` per component, colocated, exporting `VariantProps` for the prop types.
- No arbitrary values except documented exceptions; prefer scale tokens.

## 6. Storybook (optional)

If included: one story file per primitive with a control for each variant, plus an
"a11y" addon pass. Stories double as visual documentation for reviewers.
