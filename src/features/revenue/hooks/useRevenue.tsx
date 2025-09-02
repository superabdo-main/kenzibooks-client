"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useRevenueStore, Revenue } from "@/stores/revenue.store";
import { useEffect } from "react";
import { ExpenseCategory } from "@/types/expenses.type";

export const useRevenue = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  
  // Get store methods and state
  const { 
    revenues, 
    categories, 
    isLoading: storeLoading, 
    error: storeError,
    setRevenues,
    setCategories,
    createRevenue,
    deleteRevenue
  } = useRevenueStore();

  // Fetch revenues using SWR
  const { 
    data: revenuesData, 
    error: revenuesError, 
    isLoading: revenuesLoading, 
    mutate: mutateRevenues 
  } = useSWR<Revenue[]>(
    session?.accessToken && organizationId ? `/revenue/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  // Fetch categories using SWR (reusing expense categories endpoint)
  const { 
    data: categoriesData, 
    error: categoriesError, 
    isLoading: categoriesLoading, 
    mutate: mutateCategories 
  } = useSWR<ExpenseCategory[]>(
    session?.accessToken && organizationId ? `/expenses/categories/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  // Update store when SWR data changes
  useEffect(() => {
    if (revenuesData) {
      setRevenues(revenuesData);
    }
  }, [revenuesData, setRevenues]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories]);

  // Combined loading state
  const isLoading = revenuesLoading || categoriesLoading || storeLoading;
  
  // Combined error state
  const error = revenuesError || categoriesError || storeError;

  // Mutation functions that integrate with both SWR and store
  const handleCreateRevenue = async (revenueData: Parameters<typeof createRevenue>[0]['revenueData']) => {
    if (!session?.accessToken) {
      throw new Error("No access token available");
    }

    const result = await createRevenue({
      revenueData,
      accessToken: session.accessToken
    });

    // Revalidate SWR data after successful creation
    if (!result.error) {
      await mutateRevenues();
    }

    return result;
  };

  const handleDeleteRevenue = async (id: string) => {
    if (!session?.accessToken) {
      throw new Error("No access token available");
    }

    const result = await deleteRevenue({
      id,
      accessToken: session.accessToken
    });

    // Revalidate SWR data after successful deletion
    if (!result.error) {
      await mutateRevenues();
    }

    return result;
  };

  const handleRefreshCategories = async () => {
    await mutateCategories();
  };

  const handleRefreshRevenues = async () => {
    await mutateRevenues();
  };

  return {
    // Data
    revenues: revenues || [],
    categories: categories || [],
    
    // Loading states
    isLoading,
    isRevenuesLoading: revenuesLoading,
    isCategoriesLoading: categoriesLoading,
    
    // Error states
    isError: !!error,
    error: error?.message || error,
    
    // Mutation functions
    createRevenue: handleCreateRevenue,
    deleteRevenue: handleDeleteRevenue,
    
    // Refresh functions
    refreshRevenues: handleRefreshRevenues,
    refreshCategories: handleRefreshCategories,
    mutateRevenues,
    mutateCategories,
  };
};