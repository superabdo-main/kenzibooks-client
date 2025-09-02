"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { 
  DashboardStatsReport,
  RevenueChartReport,
  DashboardTopProductsReport,
  ProductPerformanceReport,
  NewCustomersReport
} from "@/types/reports.type";

export const useDashboardStats = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    dashboardStats, 
    setDashboardStats,
    setLoadingDashboardStats
  } = useDashboardStore();

  const { data, error, isLoading, mutate } = useSWR<{data: DashboardStatsReport, status: number}>(
    session?.accessToken && organizationId 
      ? `/reports/dashboard/stats/${organizationId}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  useEffect(() => {
    if (data) {
      setDashboardStats(data);
    }
    
    setLoadingDashboardStats(isLoading);
  }, [data, isLoading, dashboardStats, setDashboardStats, setLoadingDashboardStats]);

  return {
    dashboardStats: data || dashboardStats,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useRevenueChart = (months: number = 6) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    revenueChartData, 
    setRevenueChartData,
    setLoadingRevenueChart
  } = useDashboardStore();

  const { data, error, isLoading, mutate } = useSWR<{data: RevenueChartReport[], status: number}>(
    session?.accessToken && organizationId 
      ? `/reports/dashboard/revenue/${organizationId}?months=${months}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  useEffect(() => {
    if (data) {
      setRevenueChartData(data);
    }
    
    setLoadingRevenueChart(isLoading);
  }, [data, isLoading, revenueChartData, setRevenueChartData, setLoadingRevenueChart]);

  return {
    revenueChartData: data || revenueChartData,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useTopProductsChart = (limit: number = 5) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    topProductsData, 
    setTopProductsData,
    setLoadingTopProducts
  } = useDashboardStore();

  const { data, error, isLoading, mutate } = useSWR<{data: DashboardTopProductsReport[], status: number}>(
    session?.accessToken && organizationId 
      ? `/reports/dashboard/top-products/${organizationId}?limit=${limit}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  useEffect(() => {
    if (data) {
      setTopProductsData(data);
    }
    
    setLoadingTopProducts(isLoading);
  }, [data, isLoading, topProductsData, setTopProductsData, setLoadingTopProducts]);

  return {
    topProductsData: data || topProductsData,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useProductPerformance = (limit: number = 5) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    productPerformanceData, 
    setProductPerformanceData,
    setLoadingProductPerformance
  } = useDashboardStore();

  const { data, error, isLoading, mutate } = useSWR<{data: ProductPerformanceReport[], status: number}>(
    session?.accessToken && organizationId 
      ? `/reports/dashboard/product-performance/${organizationId}?limit=${limit}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  useEffect(() => {
    if (data) {
      setProductPerformanceData(data);
    }
    
    setLoadingProductPerformance(isLoading);
  }, [data, isLoading, productPerformanceData, setProductPerformanceData, setLoadingProductPerformance]);

  return {
    productPerformanceData: data || productPerformanceData,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useNewCustomersChart = (months: number = 6) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    newCustomersData, 
    setNewCustomersData,
    setLoadingNewCustomers
  } = useDashboardStore();

  const { data, error, isLoading, mutate } = useSWR<{data: NewCustomersReport[], status: number}>(
    session?.accessToken && organizationId 
      ? `/reports/dashboard/customers/${organizationId}?months=${months}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  useEffect(() => {
    if (data) {
      setNewCustomersData(data);
    }
    
    setLoadingNewCustomers(isLoading);
  }, [data, isLoading, newCustomersData, setNewCustomersData, setLoadingNewCustomers]);

  return {
    newCustomersData: data || newCustomersData,
    isLoading,
    isError: !!error,
    mutate,
  };
}; 