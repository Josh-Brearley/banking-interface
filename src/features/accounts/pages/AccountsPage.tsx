import { PageHeader } from "@/components/shared/PageHeader";
import { FeaturePlaceholder } from "@/components/shared/FeaturePlaceholder";

/** Accounts list (table/card), search & sort land on feat/accounts. */
export function AccountsPage() {
  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="All your Eagle Bank products in one place."
      />
      <FeaturePlaceholder
        spec="specs/features/accounts.spec.md"
        branch="feat/accounts"
      />
    </div>
  );
}
