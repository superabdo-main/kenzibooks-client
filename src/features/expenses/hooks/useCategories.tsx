"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { ExpenseCategory } from "@/types/expenses.type";

export const useExpenseCategories = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<ExpenseCategory[]>(
    session?.accessToken ? `/expenses/categories/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    expenseCategories: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
