"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useReportsStore } from "@/stores/reports.store";
import { 
  InventorySummaryReport, 
  LowStockReport,
  TaxReport 
} from "@/types/reports.type";

export const useInventorySummaryReport = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    inventorySummaryReport, 
    setInventorySummaryReport, 
    setLoadingInventorySummary 
  } = useReportsStore();

  const { data, error, isLoading, mutate } = useSWR<InventorySummaryReport>(
    session?.accessToken && organizationId 
      ? `/reports/inventory-summary/${organizationId}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== inventorySummaryReport) {
      setInventorySummaryReport(data);
    }
    
    // Update loading state
    setLoadingInventorySummary(isLoading);
  }, [data, isLoading, inventorySummaryReport, setInventorySummaryReport, setLoadingInventorySummary]);

  return {
    inventorySummaryReport: data || inventorySummaryReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useLowStockReport = (threshold: number = 10) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    lowStockReport, 
    setLowStockReport, 
    setLoadingLowStock 
  } = useReportsStore();
  
  const queryParams = threshold ? `?threshold=${threshold}` : '';

  const { data, error, isLoading, mutate } = useSWR<LowStockReport>(
    session?.accessToken && organizationId 
      ? `/reports/low-stock/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== lowStockReport) {
      setLowStockReport(data);
    }
    
    // Update loading state
    setLoadingLowStock(isLoading);
  }, [data, isLoading, lowStockReport, setLowStockReport, setLoadingLowStock]);

  return {
    lowStockReport: data || lowStockReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useTaxReport = (
  startDate: string, 
  endDate: string
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    taxReport, 
    setTaxReport, 
    setLoadingTaxReport 
  } = useReportsStore();
  
  const queryParams = startDate && endDate ? 
    `?startDate=${startDate}&endDate=${endDate}` : '';

  const { data, error, isLoading, mutate } = useSWR<TaxReport>(
    session?.accessToken && organizationId && startDate && endDate
      ? `/reports/tax/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== taxReport) {
      setTaxReport(data);
    }
    
    // Update loading state
    setLoadingTaxReport(isLoading);
  }, [data, isLoading, taxReport, setTaxReport, setLoadingTaxReport]);

  return {
    taxReport: data || taxReport,
    isLoading,
    isError: !!error,
    mutate,
  };
}; 