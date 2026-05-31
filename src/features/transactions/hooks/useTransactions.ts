import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import * as txnService from "@/services/transactions.service";
import type { TransactionQuery } from "@/services/transactions.service";

/** Paginated transactions query — keeps the previous page during fetch. */
export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: queryKeys.transactions.list(query),
    queryFn: () => txnService.listTransactions(query),
    placeholderData: keepPreviousData,
  });
}
