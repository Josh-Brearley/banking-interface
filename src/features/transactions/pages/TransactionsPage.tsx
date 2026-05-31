import { PageHeader } from "@/components/shared/PageHeader";
import { FeaturePlaceholder } from "@/components/shared/FeaturePlaceholder";

/** History, filters, sort, pagination & detail drawer land on feat/transactions. */
export function TransactionsPage() {
  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Search and review your activity."
      />
      <FeaturePlaceholder
        spec="specs/features/transactions.spec.md"
        branch="feat/transactions"
      />
    </div>
  );
}
