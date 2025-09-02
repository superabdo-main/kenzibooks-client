import { create } from 'zustand';
import {
  BalanceSheetReport,
  CashFlowReport,
  CustomerSalesReport,
  InventorySummaryReport,
  LowStockReport,
  ProfitAndLossReport,
  SalesSummaryReport,
  TaxReport,
  TopProductsReport,
} from '@/types/reports.type';

interface ReportsState {
  // Financial Reports
  profitAndLossReport: ProfitAndLossReport | null;
  balanceSheetReport: BalanceSheetReport | null;
  cashFlowReport: CashFlowReport | null;
  
  // Sales Reports
  salesSummaryReport: SalesSummaryReport | null;
  topProductsReport: TopProductsReport | null;
  customerSalesReport: CustomerSalesReport | null;
  
  // Inventory Reports
  inventorySummaryReport: InventorySummaryReport | null;
  lowStockReport: LowStockReport | null;
  
  // Tax Report
  taxReport: TaxReport | null;
  
  // Loading States
  loadingProfitAndLoss: boolean;
  loadingBalanceSheet: boolean;
  loadingCashFlow: boolean;
  loadingSalesSummary: boolean;
  loadingTopProducts: boolean;
  loadingCustomerSales: boolean;
  loadingInventorySummary: boolean;
  loadingLowStock: boolean;
  loadingTaxReport: boolean;
  
  // Actions
  setProfitAndLossReport: (report: ProfitAndLossReport | null) => void;
  setBalanceSheetReport: (report: BalanceSheetReport | null) => void;
  setCashFlowReport: (report: CashFlowReport | null) => void;
  setSalesSummaryReport: (report: SalesSummaryReport | null) => void;
  setTopProductsReport: (report: TopProductsReport | null) => void;
  setCustomerSalesReport: (report: CustomerSalesReport | null) => void;
  setInventorySummaryReport: (report: InventorySummaryReport | null) => void;
  setLowStockReport: (report: LowStockReport | null) => void;
  setTaxReport: (report: TaxReport | null) => void;
  
  setLoadingProfitAndLoss: (loading: boolean) => void;
  setLoadingBalanceSheet: (loading: boolean) => void;
  setLoadingCashFlow: (loading: boolean) => void;
  setLoadingSalesSummary: (loading: boolean) => void;
  setLoadingTopProducts: (loading: boolean) => void;
  setLoadingCustomerSales: (loading: boolean) => void;
  setLoadingInventorySummary: (loading: boolean) => void;
  setLoadingLowStock: (loading: boolean) => void;
  setLoadingTaxReport: (loading: boolean) => void;
  
  // Clear all reports
  clearAllReports: () => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  // Initial Report States
  profitAndLossReport: null,
  balanceSheetReport: null,
  cashFlowReport: null,
  salesSummaryReport: null,
  topProductsReport: null,
  customerSalesReport: null,
  inventorySummaryReport: null,
  lowStockReport: null,
  taxReport: null,
  
  // Initial Loading States
  loadingProfitAndLoss: false,
  loadingBalanceSheet: false,
  loadingCashFlow: false,
  loadingSalesSummary: false,
  loadingTopProducts: false,
  loadingCustomerSales: false,
  loadingInventorySummary: false,
  loadingLowStock: false,
  loadingTaxReport: false,
  
  // Report Setters
  setProfitAndLossReport: (report) => set({ profitAndLossReport: report }),
  setBalanceSheetReport: (report) => set({ balanceSheetReport: report }),
  setCashFlowReport: (report) => set({ cashFlowReport: report }),
  setSalesSummaryReport: (report) => set({ salesSummaryReport: report }),
  setTopProductsReport: (report) => set({ topProductsReport: report }),
  setCustomerSalesReport: (report) => set({ customerSalesReport: report }),
  setInventorySummaryReport: (report) => set({ inventorySummaryReport: report }),
  setLowStockReport: (report) => set({ lowStockReport: report }),
  setTaxReport: (report) => set({ taxReport: report }),
  
  // Loading State Setters
  setLoadingProfitAndLoss: (loading) => set({ loadingProfitAndLoss: loading }),
  setLoadingBalanceSheet: (loading) => set({ loadingBalanceSheet: loading }),
  setLoadingCashFlow: (loading) => set({ loadingCashFlow: loading }),
  setLoadingSalesSummary: (loading) => set({ loadingSalesSummary: loading }),
  setLoadingTopProducts: (loading) => set({ loadingTopProducts: loading }),
  setLoadingCustomerSales: (loading) => set({ loadingCustomerSales: loading }),
  setLoadingInventorySummary: (loading) => set({ loadingInventorySummary: loading }),
  setLoadingLowStock: (loading) => set({ loadingLowStock: loading }),
  setLoadingTaxReport: (loading) => set({ loadingTaxReport: loading }),
  
  // Clear all reports
  clearAllReports: () => set({
    profitAndLossReport: null,
    balanceSheetReport: null,
    cashFlowReport: null,
    salesSummaryReport: null,
    topProductsReport: null,
    customerSalesReport: null,
    inventorySummaryReport: null,
    lowStockReport: null,
    taxReport: null,
  }),
})); 