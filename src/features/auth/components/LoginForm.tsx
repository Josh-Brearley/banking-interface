import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { ApiError } from "@/lib/api/client";
import { loginSchema, type LoginValues } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useAuthMutations";

export function LoginForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      const from = params.get("from");
      navigate(from ? decodeURIComponent(from) : "/dashboard", {
        replace: true,
      });
    } catch {
      // Error surfaced via login.isError below.
    }
  });

  const errorMessage =
    login.error instanceof ApiError
      ? login.error.message
      : login.isError
        ? "Something went wrong. Please try again."
        : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-h2">Welcome back</h1>
        <p className="mt-1 text-body-sm text-foreground-muted">
          Log in to your Eagle Bank account.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          {errorMessage && (
            <p
              role="alert"
              className="rounded-md bg-danger-subtle px-3 py-2 text-body-sm text-danger"
            >
              {errorMessage}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            showPasswordToggle
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" isLoading={login.isPending} fullWidth>
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-body-sm text-foreground-muted">
          New to Eagle Bank?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
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
