import { Suspense, useRef, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouteFocus } from "@/hooks/useRouteFocus";
import {
  Spinner,
  IconDashboard,
  IconAccounts,
  IconTransactions,
  IconProfile,
} from "@/components/atoms";
import { BrandLogo } from "@/components/molecules/BrandLogo";
import { cn, getInitials } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
  { to: "/accounts", label: "Accounts", icon: <IconAccounts /> },
  { to: "/transactions", label: "Transactions", icon: <IconTransactions /> },
  { to: "/profile", label: "Profile", icon: <IconProfile /> },
];

/** Authenticated app shell: nav + main outlet, specs/01-architecture.md §4. */
export function AppShell() {
  const { user } = useAuth();
  const mainRef = useRef<HTMLElement>(null);
  useRouteFocus(mainRef);

  return (
    <div className="bg-app-canvas min-h-screen md:h-screen md:overflow-hidden md:p-4">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="md:grid md:h-[calc(100vh-2rem)] md:grid-cols-[248px_1fr] md:overflow-hidden md:rounded-[20px] md:bg-surface md:shadow-lg">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-6 md:overflow-y-auto md:border-b-0 md:border-r md:px-3 md:py-6">
          <div className="flex items-center md:justify-center md:border-b md:border-border md:pb-5">
            <BrandLogo variant="icon" className="h-12 w-12 md:h-16 md:w-16" />
          </div>

          <nav aria-label="Primary" className="hidden md:block">
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-wider text-foreground-muted">
              Menu
            </p>
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium transition-colors duration-fast",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
                      )
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile summary; logout now lives on the Profile page. */}
          <NavLink
            to="/profile"
            className="hidden rounded-lg bg-surface-muted px-3 py-2.5 transition-colors hover:bg-surface-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:mt-auto md:flex md:items-center md:gap-3"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary"
              aria-hidden="true"
            >
              {user ? getInitials(user.fullName) : "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium">
                {user?.fullName}
              </p>
              <p className="truncate text-caption text-foreground-muted">
                Personal account
              </p>
            </div>
          </NavLink>
        </header>

        {/* Mobile bottom nav */}
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-sticky flex border-t border-border bg-surface md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-center text-caption font-medium",
                  isActive ? "text-primary" : "text-foreground-muted",
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main
          ref={mainRef}
          id="main-content"
          className="bg-background px-4 py-6 pb-24 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:h-full md:min-h-0 md:overflow-y-auto md:px-8 md:py-8 md:pb-8"
          tabIndex={-1}
        >
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
