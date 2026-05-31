import { useAuth } from "@/app/providers/AuthProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRegion,
} from "@/components/ui";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { BalanceSummary } from "../components/BalanceSummary";
import { RecentTransactions } from "../components/RecentTransactions";
import { QuickActions } from "../components/QuickActions";

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";
  const { data: summary, isPending, isError, refetch } = useDashboardSummary();

  const isEmpty =
    summary?.accountsCount === 0 && summary.recentTransactions.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={`Good to see you, ${firstName}`}
        subtitle="Here's an overview of your money."
      />

      <div className="mb-6">
        <QuickActions />
      </div>

      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <Card>
          <ErrorState
            title="We couldn't load your dashboard"
            description="There was a problem loading your overview."
            onRetry={() => refetch()}
          />
        </Card>
      ) : isEmpty ? (
        <Card>
          <EmptyState
            title="Nothing here yet"
            description="Once you have accounts and activity, your balance and recent transactions will appear here."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <BalanceSummary summary={summary} />
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <SkeletonRegion label="Loading dashboard" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-32" />
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <Skeleton className="h-5 w-32" />
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    </SkeletonRegion>
  );
}
