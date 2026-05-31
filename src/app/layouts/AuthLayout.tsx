import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Spinner } from "@/components/ui";
import { BrandLogo } from "@/components/shared/BrandLogo";

/**
 * Public layout for /login and /register — AUTH-FR-09. Already-authenticated
 * users are redirected to the dashboard.
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="full" className="h-12" />
        </div>
        <Outlet />
      </div>
    </main>
  );
}
