"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

interface Category {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}


interface ProductInitials {
  categories: Category[];
  warehouses: Warehouse[];
}

export const useProductInitials = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<ProductInitials>(
    session?.accessToken ? `/product/initials/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    categories: data?.categories || [],
    warehouses: data?.warehouses || [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
