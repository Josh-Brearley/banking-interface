import { useAuth } from "@/app/providers/AuthProvider";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRegion,
} from "@/components/atoms";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { AccountCard } from "../components/AccountCard";
import { BalanceSummary } from "../components/BalanceSummary";
import { RecentTransactions } from "../components/RecentTransactions";
import { RightRail } from "../components/RightRail";

export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";
  const { data: summary, isPending, isError, refetch } = useDashboardSummary();

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const isEmpty =
    summary?.accountsCount === 0 && summary.recentTransactions.length === 0;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={`${timeGreeting}, ${firstName}`} />

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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <AccountCard
              totalBalanceMinor={summary.totalBalanceMinor}
              accountsCount={summary.accountsCount}
            />
            <BalanceSummary summary={summary} />
            <RecentTransactions transactions={summary.recentTransactions} />
          </div>
          <RightRail accountsCount={summary.accountsCount} />
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <SkeletonRegion
      label="Loading dashboard"
      className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]"
    >
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <Skeleton className="h-5 w-24" />
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
            <Skeleton className="h-44 w-full max-w-[340px] rounded-[14px] lg:w-[44%]" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-10 w-40" />
              <div className="mt-5 flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 flex-1 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="mt-3 h-4 w-28" />
              <Skeleton className="mt-2 h-8 w-32" />
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <Skeleton className="mx-auto h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto mt-3 h-5 w-32" />
        <Skeleton className="mx-auto mt-2 h-4 w-24" />
      </Card>
    </SkeletonRegion>
  );
}
