import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { AppShell } from "@/app/layouts/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";

/**
 * Route tree with per-page code splitting — specs/01-architecture.md §4.
 * Each page is its own chunk via React.lazy.
 */
const LoginPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.RegisterPage })),
);
const DashboardPage = lazy(() =>
  import("@/features/dashboard").then((m) => ({ default: m.DashboardPage })),
);
const AccountsPage = lazy(() =>
  import("@/features/accounts").then((m) => ({ default: m.AccountsPage })),
);
const TransactionsPage = lazy(() =>
  import("@/features/transactions").then((m) => ({
    default: m.TransactionsPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile").then((m) => ({ default: m.ProfilePage })),
);
const NotFoundPage = lazy(() =>
  import("@/features/misc/pages/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  })),
);

export const router = createBrowserRouter([
  { index: true, element: <Navigate to="/dashboard" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "accounts", element: <AccountsPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
