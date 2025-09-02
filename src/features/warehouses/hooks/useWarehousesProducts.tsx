"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { Product } from "@/types/products.type";

export const useWarehouseProducts = ({warehouseId}: {warehouseId: string}) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    session?.accessToken ? `/warehouse/products/${organizationId}/${warehouseId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    products: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
