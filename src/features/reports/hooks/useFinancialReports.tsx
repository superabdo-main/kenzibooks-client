"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useReportsStore } from "@/stores/reports.store";
import { 
  ProfitAndLossReport, 
  BalanceSheetReport, 
  CashFlowReport 
} from "@/types/reports.type";

export const useProfitAndLossReport = (
  startDate: string, 
  endDate: string
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    profitAndLossReport, 
    setProfitAndLossReport, 
    setLoadingProfitAndLoss 
  } = useReportsStore();
  
  const queryParams = startDate && endDate ? 
    `?startDate=${startDate}&endDate=${endDate}` : '';

  const { data, error, isLoading, mutate } = useSWR<ProfitAndLossReport>(
    session?.accessToken && organizationId 
      ? `/reports/profit-loss/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== profitAndLossReport) {
      setProfitAndLossReport(data);
    }
    
    // Update loading state
    setLoadingProfitAndLoss(isLoading);
  }, [data, isLoading, profitAndLossReport, setProfitAndLossReport, setLoadingProfitAndLoss]);

  return {
    profitAndLossReport: data || profitAndLossReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useBalanceSheetReport = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    balanceSheetReport, 
    setBalanceSheetReport, 
    setLoadingBalanceSheet 
  } = useReportsStore();

  const { data, error, isLoading, mutate } = useSWR<BalanceSheetReport>(
    session?.accessToken && organizationId 
      ? `/reports/balance-sheet/${organizationId}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== balanceSheetReport) {
      setBalanceSheetReport(data);
    }
    
    // Update loading state
    setLoadingBalanceSheet(isLoading);
  }, [data, isLoading, balanceSheetReport, setBalanceSheetReport, setLoadingBalanceSheet]);

  return {
    balanceSheetReport: data || balanceSheetReport,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useCashFlowReport = (
  startDate: string, 
  endDate: string
) => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { 
    cashFlowReport, 
    setCashFlowReport, 
    setLoadingCashFlow 
  } = useReportsStore();
  
  const queryParams = startDate && endDate ? 
    `?startDate=${startDate}&endDate=${endDate}` : '';

  const { data, error, isLoading, mutate } = useSWR<CashFlowReport>(
    session?.accessToken && organizationId 
      ? `/reports/cash-flow/${organizationId}${queryParams}` 
      : null,
    session?.accessToken 
      ? swrAuthenticatedFetcher(session?.accessToken!) 
      : null,
  );

  // Use useEffect to update the store when data or isLoading changes
  useEffect(() => {
    // Update the store when data changes
    if (data && data !== cashFlowReport) {
      setCashFlowReport(data);
    }
    
    // Update loading state
    setLoadingCashFlow(isLoading);
  }, [data, isLoading, cashFlowReport, setCashFlowReport, setLoadingCashFlow]);

  return {
    cashFlowReport: data || cashFlowReport,
    isLoading,
    isError: !!error,
    mutate,
  };
}; 