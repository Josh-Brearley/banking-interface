import { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";

interface Options extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  withAuth?: boolean;
}

// Opt into v7 behaviours to match the app router and silence migration warnings.
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

/**
 * Render a component inside the app's providers, specs/04-testing-strategy.md §2.
 * Uses a fresh QueryClient with retries disabled for deterministic tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ["/"], withAuth = true, ...options }: Options = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    const tree = (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries} future={routerFuture}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
    return withAuth ? (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries} future={routerFuture}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ) : (
      tree
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
