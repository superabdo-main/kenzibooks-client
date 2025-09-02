"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { PurchaseType } from "@/types/purchases.type";

export const usePurchases = ({type}: {type: 'PURCHASE' | 'PURCHASE_ESTIMATES' | 'DEBIT_NOTE' | 'BILL'}) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);


  const { data, error, isLoading, mutate } = useSWR<PurchaseType[]>(
    session?.accessToken ? `/purchase/findmany/${type}/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    purchases: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
