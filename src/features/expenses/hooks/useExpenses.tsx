"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { ExpenseInstance } from "@/types/expenses.type";

export const useExpenses = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<ExpenseInstance[]>(
    session?.accessToken ? `/expenses/expenses/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    expenses: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
