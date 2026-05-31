import type { Session } from "@/types";

/**
 * Session persistence — specs/features/auth.spec.md §4.3.
 * Stored under a single namespaced LocalStorage key. Corrupt/unavailable
 * storage is treated as "logged out" rather than crashing (AUTH edge cases).
 */
const STORAGE_KEY = "eaglebank.session";

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    clearSession();
    return null;
  }
}

export function writeSession(session: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable — non-fatal in a mock app */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
