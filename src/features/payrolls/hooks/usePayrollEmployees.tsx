"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { EmployeePaySchedule } from "@/types/employee.type";

export const usePayrollsEmployees = ({ id }: { id: string }) => {
  const { session } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<EmployeePaySchedule[]>(
    session?.accessToken ? `/employee/get-payrolls-employees/${id}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    employees: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
