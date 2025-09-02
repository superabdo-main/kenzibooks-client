"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { EmployeePaySchedule } from "@/types/employee.type";

export const usePayrolls = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const { data, error, isLoading, mutate } = useSWR<EmployeePaySchedule[]>(
    session?.accessToken ? `/employee/get-payroll-schedules/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    payrolls: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
