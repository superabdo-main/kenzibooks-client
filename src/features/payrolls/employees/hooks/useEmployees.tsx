"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { Employee } from "../form";

export const useEmployees = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const { data, error, isLoading, mutate } = useSWR<Employee[]>(
    session?.accessToken ? `/employee/get-employees/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    employees: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
