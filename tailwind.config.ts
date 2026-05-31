import type { Config } from "tailwindcss";

/**
 * Tailwind theme is driven by the CSS variables defined in src/styles/index.css.
 * Components reference these semantic tokens only — never raw hex/px.
 * See specs/02-design-system.md.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        foreground: {
          DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
          muted: "rgb(var(--color-foreground-muted) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
          subtle: "rgb(var(--color-secondary-subtle) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          subtle: "rgb(var(--color-success-subtle) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          subtle: "rgb(var(--color-warning-subtle) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          subtle: "rgb(var(--color-danger-subtle) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          subtle: "rgb(var(--color-info-subtle) / <alpha-value>)",
        },
        ring: "rgb(var(--color-ring) / <alpha-value>)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(11 13 18 / 0.04)",
        sm: "0 1px 3px 0 rgb(11 13 18 / 0.06), 0 1px 2px -1px rgb(11 13 18 / 0.06)",
        md: "0 4px 12px -2px rgb(11 13 18 / 0.08), 0 2px 6px -2px rgb(11 13 18 / 0.05)",
        lg: "0 12px 32px -8px rgb(11 13 18 / 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h1: ["1.75rem", { lineHeight: "2.125rem", fontWeight: "700" }],
        h2: ["1.375rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        h3: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.375rem" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.125rem" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1100",
        drawer: "1200",
        modal: "1300",
        toast: "1400",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.97) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "dialog-in": "zoom-in 200ms ease-out",
        "drawer-in": "slide-in-right 240ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
