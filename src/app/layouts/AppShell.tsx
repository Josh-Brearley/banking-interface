import { Suspense } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button, Spinner } from "@/components/ui";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn, getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/transactions", label: "Transactions" },
  { to: "/profile", label: "Profile" },
];

/** Authenticated app shell: nav + main outlet — specs/01-architecture.md §4. */
export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:flex-col md:items-stretch md:justify-start md:gap-6 md:border-b-0 md:border-r md:py-6">
        <div className="flex items-center">
          <BrandLogo
            variant="full"
            className="hidden h-9 md:block"
          />
          <BrandLogo variant="icon" className="h-8 w-8 md:hidden" />
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2 text-body font-medium transition-colors duration-fast",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:mt-auto md:flex md:items-center md:gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary"
            aria-hidden="true"
          >
            {user ? getInitials(user.fullName) : "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium">{user?.fullName}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="md:justify-start"
        >
          Log out
        </Button>
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
                "flex-1 px-2 py-3 text-center text-caption font-medium",
                isActive ? "text-primary" : "text-foreground-muted",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main
        id="main-content"
        className="px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8"
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
  );
}
