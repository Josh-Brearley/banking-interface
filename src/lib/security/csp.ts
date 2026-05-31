/**
 * Content-Security-Policy for the production build (NFR-SEC-01).
 *
 * Injected as a `<meta http-equiv="Content-Security-Policy">` at build time by the
 * `csp` plugin in `vite.config.ts` (build-only, so Vite's dev server / HMR — which
 * needs inline scripts and a ws: connection — is left untouched).
 *
 * The headline guarantee is `script-src 'self'` with **no** `'unsafe-inline'` /
 * `'unsafe-eval'`: even an injected `<script>` won't execute. For that to hold, the
 * build disables Vite's inline modulepreload polyfill (see `vite.config.ts`).
 *
 * A few controls (`frame-ancestors`, HSTS, `X-Content-Type-Options`) are header-only
 * and ignored in a `<meta>`; they are deployment obligations — see
 * `specs/05-cross-cutting.md §7.1`.
 */
export const cspDirectives: Record<string, string[]> = {
  // Fallback for any fetch directive not listed explicitly.
  "default-src": ["'self'"],
  // No inline/eval: the core anti-XSS guarantee.
  "script-src": ["'self'"],
  // Inline styles cover React `style={...}` props and Vite-injected CSS.
  "style-src": ["'self'", "'unsafe-inline'"],
  // `blob:` for avatar object-URL previews; `data:` for inline raster assets.
  "img-src": ["'self'", "data:", "blob:"],
  // Self-hosted Inter (@fontsource), bundled and served from our origin.
  "font-src": ["'self'"],
  // Mock backend is in-memory; no cross-origin requests in production.
  "connect-src": ["'self'"],
  // Hardening: no plugins, no base-tag hijack, forms post to us only.
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

/** Serialise directives into a single CSP header/meta value. */
export function buildCsp(directives: Record<string, string[]> = cspDirectives): string {
  return Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}
