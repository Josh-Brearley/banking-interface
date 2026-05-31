import { describe, expect, it } from "vitest";
import { buildCsp, cspDirectives } from "./csp";

/**
 * NFR-SEC-01: the production Content-Security-Policy. These assertions pin the
 * guarantees the policy exists to provide; loosening any of them should fail here.
 */
describe("Content-Security-Policy (NFR-SEC-01)", () => {
  it("locks script-src to 'self' with no inline/eval escape hatches (core anti-XSS)", () => {
    expect(cspDirectives["script-src"]).toEqual(["'self'"]);
    expect(cspDirectives["script-src"]).not.toContain("'unsafe-inline'");
    expect(cspDirectives["script-src"]).not.toContain("'unsafe-eval'");
  });

  it("denies plugins and locks the document base/form targets", () => {
    expect(cspDirectives["object-src"]).toEqual(["'none'"]);
    expect(cspDirectives["base-uri"]).toEqual(["'self'"]);
    expect(cspDirectives["form-action"]).toEqual(["'self'"]);
  });

  it("allows data:/blob: images so avatar previews render", () => {
    expect(cspDirectives["img-src"]).toContain("'self'");
    expect(cspDirectives["img-src"]).toContain("data:");
    expect(cspDirectives["img-src"]).toContain("blob:");
  });

  it("restricts fonts and network connections to our own origin", () => {
    expect(cspDirectives["font-src"]).toEqual(["'self'"]);
    expect(cspDirectives["connect-src"]).toEqual(["'self'"]);
    expect(cspDirectives["default-src"]).toEqual(["'self'"]);
  });

  it("serialises to a single-line, '; '-joined header value", () => {
    const csp = buildCsp();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("\n");
    expect(csp.split("; ").length).toBe(Object.keys(cspDirectives).length);
  });
});
