import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button, Card, CardContent } from "@/components/ui";
import { ApiError } from "@/lib/api/client";
import * as authService from "@/services/auth.service";

/**
 * Minimal working login to validate the auth + protected-route flow.
 * The full spec (RHF + Zod, password toggle, full a11y) is delivered on
 * feat/auth — see specs/features/auth.spec.md.
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("demo@eaglebank.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await authService.login({ email, password });
      login(session);
      const from = params.get("from");
      navigate(from ? decodeURIComponent(from) : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-h2">Welcome back</h1>
        <p className="mt-1 text-body-sm text-foreground-muted">
          Log in to your Eagle Bank account.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          {error && (
            <p
              role="alert"
              className="rounded-md bg-danger-subtle px-3 py-2 text-body-sm text-danger"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-body-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border border-border bg-surface px-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-body-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border border-border bg-surface px-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-body-sm text-foreground-muted">
          New to Eagle Bank?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-caption text-foreground-muted">
          Demo: demo@eaglebank.com / Password123!
        </p>
      </CardContent>
    </Card>
  );
}
