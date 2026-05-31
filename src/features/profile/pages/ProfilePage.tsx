import { PageHeader } from "@/components/shared/PageHeader";
import { FeaturePlaceholder } from "@/components/shared/FeaturePlaceholder";

/** View/edit profile, avatar upload & validation land on feat/profile. */
export function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Manage your personal details."
      />
      <FeaturePlaceholder
        spec="specs/features/profile.spec.md"
        branch="feat/profile"
      />
    </div>
  );
}
