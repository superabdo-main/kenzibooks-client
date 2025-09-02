"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { CustomerType } from "@/types/customers";

export const useCustomers = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const { data, error, isLoading, mutate } = useSWR<CustomerType[]>(
    session?.accessToken ? `/customer/findall/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    customers: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
