"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { SupplierType } from "@/types/suppliers.type";

export const useSuppliers = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<SupplierType[]>(
    session?.accessToken ? `/supplier/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    suppliers: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
