import { Card, CardContent } from "@/components/ui";

/**
 * Temporary scaffold placeholder for features not yet implemented. Each links
 * back to its spec so the delivery path is clear. Replaced by the feature's PR.
 */
export function FeaturePlaceholder({
  spec,
  branch,
}: {
  spec: string;
  branch: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-caption font-semibold uppercase tracking-wide text-primary">
          Scaffolded
        </span>
        <p className="max-w-md text-body text-foreground-muted">
          This screen is wired into the app shell and routing. The full
          experience is delivered on{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-body-sm">
            {branch}
          </code>{" "}
          against{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-body-sm">
            {spec}
          </code>
          .
        </p>
      </CardContent>
    </Card>
  );
}
