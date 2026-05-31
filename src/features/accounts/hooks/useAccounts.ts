import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import * as accountsService from "@/services/accounts.service";
import type { AccountQuery } from "@/services/accounts.service";

/** Accounts list query, specs/features/accounts.spec.md §4. */
export function useAccounts(query: AccountQuery) {
  return useQuery({
    queryKey: queryKeys.accounts.list(query),
    queryFn: () => accountsService.listAccounts(query),
    placeholderData: keepPreviousData,
  });
}
