# 05 — Cross-Cutting Concerns (Non-Functional Requirements)

> Status: Approved · Inherits: [00](./00-product-constitution.md)
> These NFRs apply to **every** feature. Feature specs reference them rather than restating.

---

## 1. Accessibility (`NFR-A11Y`) — target: Lighthouse a11y ≥ 90

| ID            | Requirement                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NFR-A11Y-01` | **Semantic HTML** first: `header/nav/main/section/footer`, `button` for actions, `a` for navigation, real form controls.                               |
| `NFR-A11Y-02` | **Keyboard:** every interaction reachable & operable by keyboard in a logical tab order; no keyboard traps (except intentional modal focus trap).      |
| `NFR-A11Y-03` | **Visible focus** via `:focus-visible` ring (`--color-ring`); never remove outlines without a replacement.                                             |
| `NFR-A11Y-04` | **Screen reader:** meaningful `alt`; labelled controls; `aria-live` for async status (loading, toasts, form errors). Decorative imagery `aria-hidden`. |
| `NFR-A11Y-05` | **ARIA only where needed** — prefer native semantics; correct `role`/`aria-*` for custom widgets (dialog, listbox, tabs, sort).                        |
| `NFR-A11Y-06` | **Labels & errors:** inputs have associated `<label>`; errors linked via `aria-describedby`, fields marked `aria-invalid`; error summaries announced.  |
| `NFR-A11Y-07` | **Colour contrast** meets WCAG AA; information never conveyed by colour alone (pair with icon/sign/text).                                              |
| `NFR-A11Y-08` | **Focus management:** route change moves focus to page heading / main; modal/drawer trap & restore focus; skip-to-content link present.                |
| `NFR-A11Y-09` | **Reduced motion:** honour `prefers-reduced-motion` everywhere.                                                                                        |
| `NFR-A11Y-10` | **Page titles:** each route sets a descriptive `document.title`.                                                                                       |

---

## 2. Performance (`NFR-PERF`) — target: Lighthouse perf ≥ 90

| ID            | Requirement                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NFR-PERF-01` | **Route-based code splitting:** every page is `React.lazy` + `Suspense` (own chunk).                                                                    |
| `NFR-PERF-02` | **Lazy load** heavy/optional UI (charts, drawers) and below-the-fold content.                                                                           |
| `NFR-PERF-03` | **Memoise deliberately:** `useMemo`/`useCallback`/`React.memo` for expensive derivations & stable props passed to memoised children — not blanket.      |
| `NFR-PERF-04` | **Efficient React Query caching:** sensible `staleTime`, `placeholderData`/`keepPreviousData` for paginated lists, no over-fetching, query-key hygiene. |
| `NFR-PERF-05` | **Avoid unnecessary re-renders:** colocate state, lift only when shared, split contexts, debounce search inputs.                                        |
| `NFR-PERF-06` | **No prop drilling** beyond one level (`ARCH-NFR-06`); compose or use context.                                                                          |
| `NFR-PERF-07` | **Bundle hygiene:** tree-shakeable imports (`date-fns/...`), no moment.js, icons imported individually.                                                 |
| `NFR-PERF-08` | **Skeletons over spinners** for perceived performance; reserve layout space to avoid CLS.                                                               |
| `NFR-PERF-09` | **Images:** sized, lazy (`loading="lazy"`), avoid layout shift.                                                                                         |

---

## 3. Error handling (`NFR-ERR`)

| ID           | Requirement                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `NFR-ERR-01` | **App-level ErrorBoundary** wraps the router with a friendly fallback (apology, reload action) — never a white screen.       |
| `NFR-ERR-02` | **Route-level boundaries** SHOULD wrap each page so one crash doesn't blank the shell.                                       |
| `NFR-ERR-03` | **Data errors** render an `ErrorState` with **retry** wired to React Query `refetch`, plus helpful, non-technical messaging. |
| `NFR-ERR-04` | **Form/API 422** maps field errors back onto the form (React Hook Form `setError`).                                          |
| `NFR-ERR-05` | **401** clears session and redirects to `/login`.                                                                            |
| `NFR-ERR-06` | **404** route renders a professional NotFound page with a route back home.                                                   |
| `NFR-ERR-07` | **Empty states** give meaningful guidance and (where relevant) a primary action — not a dead end.                            |
| `NFR-ERR-08` | User-facing copy is calm and human; technical details go to console/logging only.                                            |

---

## 4. Animation (`NFR-MOTION`)

| ID              | Requirement                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `NFR-MOTION-01` | Subtle only — page transitions, hover, button press, skeleton shimmer, modal/drawer enter/exit. |
| `NFR-MOTION-02` | Durations from motion tokens (120–320ms); easing per [design system](./02-design-system.md).    |
| `NFR-MOTION-03` | Motion must **improve usability** (orientation, feedback), never distract or delay input.       |
| `NFR-MOTION-04` | All motion disabled/reduced under `prefers-reduced-motion` (`NFR-A11Y-09`).                     |
| `NFR-MOTION-05` | Animations never block interaction or cause layout shift.                                       |

---

## 5. Responsiveness (`NFR-RESP`)

| ID            | Requirement                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `NFR-RESP-01` | **Mobile-first.** Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280`.                          |
| `NFR-RESP-02` | Verified at **375px (mobile), 768px (tablet), 1280px (desktop)**.                              |
| `NFR-RESP-03` | **Table→Card** pattern for data lists on small screens (`DataTable`).                          |
| `NFR-RESP-04` | Navigation collapses appropriately (sidebar/drawer on mobile).                                 |
| `NFR-RESP-05` | Touch targets ≥ 44×44px; no horizontal scroll; content reflows, never truncates critical info. |

---

## 6. Formatting & i18n (`NFR-FMT`)

| ID           | Requirement                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `NFR-FMT-01` | Money formatted via `Intl.NumberFormat("en-GB",{ style:"currency", currency:"GBP" })` from **minor units**. |
| `NFR-FMT-02` | Dates via `Intl.DateTimeFormat`/`date-fns`; relative ("Today", "Yesterday") where it aids scanning.         |
| `NFR-FMT-03` | Account numbers masked in UI (`•••• 4821`); full value never exposed unnecessarily.                         |
| `NFR-FMT-04` | Copy in `en-GB`; structure ready for future i18n (no hard-coded concatenated sentences).                    |
