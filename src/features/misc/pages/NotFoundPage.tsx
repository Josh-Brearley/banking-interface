import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { buttonVariants } from "@/components/atoms";
import { BrandLogo } from "@/components/molecules/BrandLogo";
import { CardGraphic } from "@/components/molecules/CardGraphic";

/** Professional, on-brand 404, NFR-ERR-06. */
export function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <main className="bg-app-canvas flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <BrandLogo variant="full" className="h-11 w-auto" />

      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface p-8 text-center shadow-lg sm:p-10">
        <CardGraphic tone="secondary" className="opacity-50" />

        <p className="relative text-display font-bold text-primary">404</p>
        <h1 className="relative mt-1 text-h2">Page not found</h1>
        <p className="relative mt-2 text-body text-foreground-muted">
          We couldn&apos;t find the page you were looking for. It may have moved,
          or the link may be incorrect.
        </p>

        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/dashboard" className={buttonVariants()}>
            Back to dashboard
          </Link>
          <Link to="/login" className={buttonVariants({ variant: "outline" })}>
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}
