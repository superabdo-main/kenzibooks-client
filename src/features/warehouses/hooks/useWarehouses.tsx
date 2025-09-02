"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { WarehouseType } from "@/types/warehouses.type";

export const useWarehouses = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<WarehouseType[]>(
    session?.accessToken ? `/warehouse/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    warehouses: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
