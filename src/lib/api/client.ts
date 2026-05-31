/**
 * Mock network layer — specs/03-api-and-data.md §3.
 * Simulates latency and failures so the UI exercises real loading/error paths.
 * No real backend exists.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** True for client errors (4xx) — React Query should not retry these. */
export function isClientError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

const DEFAULT_MIN_MS = 250;
const DEFAULT_MAX_MS = 800;

/**
 * Deterministic-ish pseudo latency without Math.random (keeps tests stable when
 * VITEST is set, where we collapse latency to near-zero).
 */
function latencyMs(min: number, max: number): number {
  if (import.meta.env?.MODE === "test") return 0;
  const span = max - min;
  return min + Math.floor((Date.now() % 1000) / 1000 * span);
}

export function delay(min = DEFAULT_MIN_MS, max = DEFAULT_MAX_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, latencyMs(min, max)));
}

/**
 * Wrap a producer in simulated network behaviour: latency + optional forced
 * failure. Pass `failWith` to demo/test error states deterministically.
 */
export async function simulateNetwork<T>(
  producer: () => T | Promise<T>,
  options: { min?: number; max?: number; failWith?: ApiError } = {},
): Promise<T> {
  await delay(options.min, options.max);
  if (options.failWith) throw options.failWith;
  return producer();
}
