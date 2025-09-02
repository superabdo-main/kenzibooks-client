"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { ExpenseType } from "@/types/expenses.type";

export const useRunningExpenses = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<ExpenseType[]>(
    session?.accessToken ? `/expenses/expenses-running/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    expenses: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
