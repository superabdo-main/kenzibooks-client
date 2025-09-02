"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

interface Initials {
  products: {
    id: string;
    salePrice: number;
    quantity: number;
    name: string;
    sku: string;
  }[];
  customers: {
    id: string;
    email: string;
  }[];
}


export const useSaleInitials = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<Initials>(
    session?.accessToken ? `/sale/initials/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    products: data?.products || [],
    customers: data?.customers || [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
