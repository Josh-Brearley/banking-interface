import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  IconLock,
  IconMail,
  IconShieldCheck,
  Input,
} from "@/components/atoms";
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
    <Card className="shadow-md">
      <CardContent className="pt-7">
        <h1 className="text-h1">Sign in</h1>
        <p className="mt-1.5 text-body-sm text-foreground-muted">
          Welcome back, log in to your Eagle Bank account.
        </p>

        <form
          className="mt-7 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
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
            leftAddon={<IconMail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            leftAddon={<IconLock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={login.isPending}
            fullWidth
            className="mt-1"
          >
            Log in
          </Button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-caption text-foreground-muted">
          <IconShieldCheck className="h-3.5 w-3.5 text-success" />
          Your connection is encrypted and secure.
        </p>

        <p className="mt-5 border-t border-border pt-5 text-center text-body-sm text-foreground-muted">
          New to Eagle Bank?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 rounded-md border border-border bg-surface-muted px-3 py-2.5 text-caption text-foreground-muted">
          <span className="font-semibold text-foreground">Demo login:</span>{" "}
          demo@eaglebank.com / Password123!
        </div>
      </CardContent>
    </Card>
  );
}
