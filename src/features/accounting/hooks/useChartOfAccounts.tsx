"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { ChartOfAccount } from "@/types/coa.type";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

interface AccountsResponse {
  data: ChartOfAccount[];
  isOk: boolean;
  status: number;
  error: string | null;
}

export const useChartOfAccounts = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);

  const { data, error, isLoading, mutate } = useSWR<AccountsResponse>(
    session?.accessToken && organizationId ? `/coa/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    accounts: data?.data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}; 