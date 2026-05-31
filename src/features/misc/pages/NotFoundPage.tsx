import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui";

/** Professional 404 — NFR-ERR-06. */
export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-display font-bold text-primary">404</p>
      <h1 className="text-h1">Page not found</h1>
      <p className="max-w-md text-foreground-muted">
        We couldn't find the page you were looking for. It may have moved, or
        the link may be incorrect.
      </p>
      <Link to="/dashboard" className={buttonVariants()}>
        Back to dashboard
      </Link>
    </main>
  );
}
