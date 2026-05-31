import type { Meta, StoryObj } from "@storybook/react";

/**
 * Foundations — the token contract behind every component. Components reference
 * these semantic tokens via Tailwind classes, never raw hex/px.
 * Source of truth: `src/styles/index.css` + `tailwind.config.ts`
 * (specs/02-design-system.md).
 */
const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ Colours */

const SEMANTIC = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-muted", className: "bg-surface-muted" },
  { name: "border", className: "bg-border" },
  { name: "foreground", className: "bg-foreground" },
  { name: "foreground-muted", className: "bg-foreground-muted" },
];

const BRAND = [
  {
    name: "primary (navy)",
    className: "bg-primary",
    on: "text-primary-foreground",
  },
  {
    name: "secondary (cyan)",
    className: "bg-secondary",
    on: "text-secondary-foreground",
  },
];

// Status colours always ship as a solid + a subtle tint (badges, stat cards).
const STATUS = [
  {
    name: "success",
    solid: "bg-success",
    subtle: "bg-success-subtle",
    text: "text-success",
  },
  {
    name: "warning",
    solid: "bg-warning",
    subtle: "bg-warning-subtle",
    text: "text-warning",
  },
  {
    name: "danger",
    solid: "bg-danger",
    subtle: "bg-danger-subtle",
    text: "text-danger",
  },
  {
    name: "info",
    solid: "bg-info",
    subtle: "bg-info-subtle",
    text: "text-info",
  },
];

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`${className} h-10 w-10 shrink-0 rounded-md border border-border`}
        aria-hidden="true"
      />
      <span className="text-body-sm">{label}</span>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-3 text-h3">Neutrals</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SEMANTIC.map((c) => (
            <Swatch key={c.name} className={c.className} label={c.name} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-h3">Brand</h3>
        <p className="mb-3 max-w-prose text-body-sm text-foreground-muted">
          Navy carries all text, links and focus. Cyan is an{" "}
          <strong>accent only</strong> — it fails AA as small text, so it never
          carries body copy.
        </p>
        <div className="flex flex-wrap gap-3">
          {BRAND.map((c) => (
            <div
              key={c.name}
              className={`${c.className} ${c.on} flex h-20 w-44 items-end rounded-lg p-3 text-body-sm font-medium`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-h3">Status (solid · subtle · text)</h3>
        <div className="flex flex-col gap-3">
          {STATUS.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span
                className={`${s.solid} h-8 w-8 rounded-md`}
                aria-hidden="true"
              />
              <span
                className={`${s.subtle} ${s.text} rounded-full px-3 py-1 text-body-sm font-medium`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};

/* -------------------------------------------------------------- Typography */

// rem sizes mirror tailwind.config.ts `fontSize` — the type ramp.
const RAMP = [
  { token: "text-display", rem: "2.25rem / 700", use: "Hero balance" },
  { token: "text-h1", rem: "1.75rem / 700", use: "Page title" },
  { token: "text-h2", rem: "1.375rem / 600", use: "Section" },
  { token: "text-h3", rem: "1.125rem / 600", use: "Card title" },
  { token: "text-body", rem: "0.9375rem", use: "Default body" },
  { token: "text-body-sm", rem: "0.8125rem", use: "Secondary / labels" },
  { token: "text-caption", rem: "0.75rem / 500", use: "Captions, meta" },
];

const WEIGHTS = [
  { w: "font-normal", label: "Regular 400" },
  { w: "font-medium", label: "Medium 500" },
  { w: "font-semibold", label: "Semibold 600" },
  { w: "font-bold", label: "Bold 700" },
];

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-1 text-h3">Typeface</h3>
        <p className="max-w-prose text-body-sm text-foreground-muted">
          <strong>Inter</strong> (variable), self-hosted via{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5">
            @fontsource-variable/inter
          </code>{" "}
          — no external request. Stack falls back to system-ui.
        </p>
        <p className="mt-3 text-h2">The quick brown fox jumps over £1,248.00</p>
      </section>

      <section>
        <h3 className="mb-3 text-h3">Type ramp</h3>
        <div className="flex flex-col gap-4">
          {RAMP.map((r) => (
            <div key={r.token} className="flex items-baseline gap-4">
              <span className={`${r.token} min-w-0 flex-1 truncate`}>
                {r.use}
              </span>
              <code className="shrink-0 text-caption text-foreground-muted">
                {r.token} · {r.rem}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-h3">Weights</h3>
        <div className="flex flex-col gap-2">
          {WEIGHTS.map((w) => (
            <p key={w.w} className={`${w.w} text-body`}>
              {w.label} — Eagle Bank
            </p>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-1 text-h3">Tabular figures</h3>
        <p className="mb-2 max-w-prose text-body-sm text-foreground-muted">
          Money uses{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5">
            tabular-nums
          </code>{" "}
          so digits align in columns.
        </p>
        <div className="flex w-40 flex-col items-end font-medium tabular-nums">
          <span>£1,248.00</span>
          <span>£35.50</span>
          <span>£8,999.00</span>
        </div>
      </section>
    </div>
  ),
};

/* ------------------------------------------------ Spacing / Radii / Shadow */

const SPACING = [1, 2, 3, 4, 6, 8, 12];
const RADII = [
  { token: "rounded-sm", px: "6px" },
  { token: "rounded-md", px: "10px" },
  { token: "rounded-lg", px: "14px" },
  { token: "rounded-full", px: "9999px" },
];
const SHADOWS = ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"];

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <h3 className="mb-2 text-h3">Spacing scale (Tailwind 4px base)</h3>
      {SPACING.map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-16 text-caption text-foreground-muted">
            {s} · {s * 4}px
          </span>
          <span className="h-4 bg-secondary" style={{ width: `${s * 4}px` }} />
        </div>
      ))}
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {RADII.map((r) => (
        <div key={r.token} className="flex flex-col items-center gap-2">
          <span
            className={`${r.token} h-16 w-16 border border-border bg-surface-muted`}
          />
          <code className="text-caption text-foreground-muted">{r.token}</code>
          <span className="text-caption text-foreground-muted">{r.px}</span>
        </div>
      ))}
    </div>
  ),
};

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-2">
      {SHADOWS.map((s) => (
        <div key={s} className="flex flex-col items-center gap-3">
          <span className={`${s} h-20 w-28 rounded-lg bg-surface`} />
          <code className="text-caption text-foreground-muted">{s}</code>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------- Motion */

const DURATIONS = [
  { token: "duration-fast", ms: "120ms", use: "Hover/colour" },
  { token: "duration-base", ms: "200ms", use: "Dialogs, fades" },
  { token: "duration-slow", ms: "320ms", use: "Larger surfaces" },
];

export const Motion: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-prose text-body-sm text-foreground-muted">
        Three motion tokens; all animation is gated behind{" "}
        <code className="rounded bg-surface-muted px-1.5 py-0.5">
          prefers-reduced-motion
        </code>
        . Hover a swatch to feel the duration.
      </p>
      <div className="flex flex-wrap gap-6">
        {DURATIONS.map((d) => (
          <div key={d.token} className="flex flex-col items-center gap-2">
            <span
              className={`${d.token} h-16 w-16 rounded-lg bg-primary transition-colors hover:bg-secondary`}
            />
            <code className="text-caption text-foreground-muted">
              {d.token}
            </code>
            <span className="text-caption text-foreground-muted">
              {d.ms} · {d.use}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
