import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { _userStore } from "@/services/auth.service";

// RTL cleanup + isolated session/store/mocks per test (specs/04-testing-strategy.md §2).
afterEach(() => {
  cleanup();
  localStorage.clear();
  _userStore.reset(); // undo any in-memory profile mutations from the mock backend
  vi.restoreAllMocks();
});

// jsdom doesn't implement object URLs; used by avatar preview.
if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:mock-object-url";
  URL.revokeObjectURL = () => {};
}

// jsdom doesn't implement matchMedia; provide a no-op for useMediaQuery etc.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
