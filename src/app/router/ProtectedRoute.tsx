import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Spinner } from "@/components/ui";

/**
 * Guards authenticated routes — AUTH-FR-07/08. Unauthenticated users are sent to
 * /login with the intended path preserved in `?from=`.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner
          className="h-6 w-6 text-primary"
          label="Loading your account"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?from=${from}`} replace />;
  }

  return <Outlet />;
}
