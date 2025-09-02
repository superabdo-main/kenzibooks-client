"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { ExpenseSubCategory } from "@/types/expenses.type";

export const useExpenseSubCategories = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<ExpenseSubCategory[]>(
    session?.accessToken ? `/expenses/subcategories/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    expenseSubCategories: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
