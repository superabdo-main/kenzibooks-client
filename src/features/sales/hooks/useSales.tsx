"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { SaleType } from "@/types/sales.type";

export const useSales = ({type}: {type: 'SALE' | 'ESTIMATED_SALE' | 'INVOICE' | 'CREDIT_NOTE'}) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<SaleType[]>(
    session?.accessToken ? `/sale/findmany/${type}/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    sales: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
