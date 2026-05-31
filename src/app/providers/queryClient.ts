import { QueryClient } from "@tanstack/react-query";
import { isClientError } from "@/lib/api/client";

/**
 * Shared QueryClient, specs/01-architecture.md §5.
 * 4xx ApiErrors are not retried; transient/5xx errors retry up to twice.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        throwOnError: false,
        retry: (failureCount, error) => {
          if (isClientError(error)) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: 0 },
    },
  });
}
