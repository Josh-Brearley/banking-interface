import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Input } from "@/components/atoms";
import { ApiError } from "@/lib/api/client";
import { registerSchema, type RegisterValues } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useAuthMutations";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Map a server email conflict onto the field (AUTH-FR / NFR-ERR-04).
      if (err instanceof ApiError && err.fieldErrors?.email) {
        setError("email", { message: err.fieldErrors.email });
      }
    }
  });

  const generalError =
    registerMutation.error instanceof ApiError &&
    !registerMutation.error.fieldErrors
      ? registerMutation.error.message
      : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-h2">Create your account</h1>
        <p className="mt-1 text-body-sm text-foreground-muted">
          Join Eagle Bank in minutes.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          {generalError && (
            <p
              role="alert"
              className="rounded-md bg-danger-subtle px-3 py-2 text-body-sm text-danger"
            >
              {generalError}
            </p>
          )}

          <Input
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
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
            autoComplete="new-password"
            showPasswordToggle
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            isLoading={registerMutation.isPending}
            fullWidth
          >
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-body-sm text-foreground-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
