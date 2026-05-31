import { describe, it, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

// NFR-A11Y-10, each route sets a descriptive, suffixed document.title.
describe("useDocumentTitle", () => {
  const original = document.title;
  afterEach(() => {
    document.title = original;
  });

  it("sets a descriptive, brand-suffixed document title", () => {
    renderHook(() => useDocumentTitle("Dashboard"));
    expect(document.title).toBe("Dashboard · Eagle Bank");
  });

  it("uses the bare brand name when no page title is given", () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe("Eagle Bank");
  });

  it("restores the previous title on unmount", () => {
    document.title = "Before";
    const { unmount } = renderHook(() => useDocumentTitle("Accounts"));
    expect(document.title).toBe("Accounts · Eagle Bank");
    unmount();
    expect(document.title).toBe("Before");
  });
});
