"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { Product } from "@/types/products.type"; // Replace with your actual type
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

export const useProducts = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    session?.accessToken ? `/product/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    products: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
