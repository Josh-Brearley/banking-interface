import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import * as dashboardService from "@/services/dashboard.service";

/** Dashboard overview query — specs/features/dashboard.spec.md §4.2. */
export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => dashboardService.getSummary(),
  });
}
