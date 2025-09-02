"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useReportsStore } from "@/stores/reports.store";
import { 
  SalesSummaryReport, 
  TopProductsReport,
  CustomerSalesReport 
} from "@/types/reports.type";

export const useSalesSummaryReport = (
  startDate: string, 
  endDate: string
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    salesSummaryReport, 
    setSalesSummaryReport, 
    setLoadingSalesSummary 
  } = useReportsStore();
  
  const queryParams = startDate && endDate ? 
    `?startDate=${startDate}&endDate=${endDate}` : '';

  const { data, error, isLoading, mutate } = useSWR<SalesSummaryReport>(
    session?.accessToken && organizationId 
      ? `/reports/sales-summary/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== salesSummaryReport) {
      setSalesSummaryReport(data);
    }
    
    // Update loading state
    setLoadingSalesSummary(isLoading);
  }, [data, isLoading, salesSummaryReport, setSalesSummaryReport, setLoadingSalesSummary]);

  return {
    salesSummaryReport: data || salesSummaryReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useTopProductsReport = (
  startDate: string, 
  endDate: string,
  limit: number = 5
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    topProductsReport, 
    setTopProductsReport, 
    setLoadingTopProducts 
  } = useReportsStore();
  
  const queryParams = `?startDate=${startDate}&endDate=${endDate}${limit ? `&limit=${limit}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<TopProductsReport>(
    session?.accessToken && organizationId && startDate && endDate
      ? `/reports/top-products/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== topProductsReport) {
      setTopProductsReport(data);
    }
    
    // Update loading state
    setLoadingTopProducts(isLoading);
  }, [data, isLoading, topProductsReport, setTopProductsReport, setLoadingTopProducts]);

  return {
    topProductsReport: data || topProductsReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useCustomerSalesReport = (
  startDate: string, 
  endDate: string,
  limit: number = 10
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    customerSalesReport, 
    setCustomerSalesReport, 
    setLoadingCustomerSales 
  } = useReportsStore();
  
  const queryParams = `?startDate=${startDate}&endDate=${endDate}${limit ? `&limit=${limit}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<CustomerSalesReport>(
    session?.accessToken && organizationId && startDate && endDate
      ? `/reports/customer-sales/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== customerSalesReport) {
      setCustomerSalesReport(data);
    }
    
    // Update loading state
    setLoadingCustomerSales(isLoading);
  }, [data, isLoading, customerSalesReport, setCustomerSalesReport, setLoadingCustomerSales]);

  return {
    customerSalesReport: data || customerSalesReport,
    isLoading,
    isError: !!error,
    mutate,
  };
}; 