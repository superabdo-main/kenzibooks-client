"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { Category } from "@/types/category";

export const useCategories = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    session?.accessToken ? `/category/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    categories: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
