"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "../form";

export const useOneEmployee = ({ id }: { id: string }) => {
  const { session } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Employee>(
    session?.accessToken ? `/employee/get-employee/${id}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    employee: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
