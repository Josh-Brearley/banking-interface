import { useAuth } from "@/app/providers/AuthProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeaturePlaceholder } from "@/components/shared/FeaturePlaceholder";

/** Overview cards, recent activity & quick actions land on feat/dashboard. */
export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div>
      <PageHeader
        title={`Good to see you, ${firstName}`}
        subtitle="Here's an overview of your money."
      />
      <FeaturePlaceholder
        spec="specs/features/dashboard.spec.md"
        branch="feat/dashboard"
      />
    </div>
  );
}
