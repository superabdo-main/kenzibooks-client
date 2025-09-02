"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { Tax } from "@/types/tax";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

export const useTaxes = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);

  const { data, error, isLoading, mutate } = useSWR<Tax[]>(
    session?.accessToken ? `/tax/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    taxes: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}; 