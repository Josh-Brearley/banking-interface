import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui";
import { FeaturePlaceholder } from "@/components/shared/FeaturePlaceholder";

/** Full registration form is delivered on feat/auth — specs/features/auth.spec.md. */
export function RegisterPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-h2">Create your account</h1>
        <p className="mt-1 text-body-sm text-foreground-muted">
          Join Eagle Bank in minutes.
        </p>
        <div className="mt-6">
          <FeaturePlaceholder
            spec="specs/features/auth.spec.md"
            branch="feat/auth"
          />
        </div>
        <p className="mt-4 text-center text-body-sm text-foreground-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
