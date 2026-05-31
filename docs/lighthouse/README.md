# Lighthouse / accessibility proof

A **real headless-Chrome** Lighthouse run over the production build (`vite build` → served
statically), the median of 3 runs. This is the browser-based evidence that complements the
jsdom axe-core suite — which deliberately excludes `color-contrast` because jsdom has no layout
engine ([`src/tests/axe.ts`](../../src/tests/axe.ts)).

Captured 2026-05-31 · Lighthouse 12 · `npm run lighthouse` (config:
[`lighthouserc.json`](../../lighthouserc.json)).

## Scores (median of 3 runs)

| Category       |   Score |
| -------------- | ------: |
| Performance    |      94 |
| Accessibility  | **100** |
| Best Practices | **100** |
| SEO            | **100** |

(Performance ranged 88–94 across runs on a local machine; CI asserts ≥ 90 as a warning.
Accessibility ≥ 90 is a **hard error gate** in `lighthouserc.json` and passed at 100.)

## Key accessibility audits

These are the browser-only checks jsdom can't perform — all pass:

- ✅ **`color-contrast`** — foreground/background ratios meet WCAG AA (the token palette is
  AA-safe; cyan is accent-only, never body text).
- ✅ `tap-targets`, `image-alt`, `document-title`, `html-has-lang`, `meta-viewport`
  (zoom not disabled), `heading-order`, `link-name`.

## Full report

Open [`report.html`](./report.html) in a browser for the complete audit (all categories,
per-audit detail, and the trace).

## Reproduce

```bash
npm run lighthouse   # builds, runs Lighthouse 3× over ./dist, asserts the budgets
```

The raw run output lands in `.lighthouseci/` (gitignored); this folder holds the committed
snapshot used as proof.
