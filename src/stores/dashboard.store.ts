import { create } from 'zustand';
import {
  DashboardStatsReport,
  RevenueChartReport,
  DashboardTopProductsReport,
  ProductPerformanceReport,
  NewCustomersReport,
} from '@/types/reports.type';

interface DashboardState {
  // Dashboard Reports
  dashboardStats: DashboardStatsReport | null;
  revenueChartData: RevenueChartReport[] | null;
  topProductsData: DashboardTopProductsReport[] | null;
  productPerformanceData: ProductPerformanceReport[] | null;
  newCustomersData: NewCustomersReport[] | null;
  
  // Loading States
  loadingDashboardStats: boolean;
  loadingRevenueChart: boolean;
  loadingTopProducts: boolean;
  loadingProductPerformance: boolean;
  loadingNewCustomers: boolean;
  
  // Actions
  setDashboardStats: (data: DashboardStatsReport | null) => void;
  setRevenueChartData: (data: RevenueChartReport[] | null) => void;
  setTopProductsData: (data: DashboardTopProductsReport[] | null) => void;
  setProductPerformanceData: (data: ProductPerformanceReport[] | null) => void;
  setNewCustomersData: (data: NewCustomersReport[] | null) => void;
  
  setLoadingDashboardStats: (loading: boolean) => void;
  setLoadingRevenueChart: (loading: boolean) => void;
  setLoadingTopProducts: (loading: boolean) => void;
  setLoadingProductPerformance: (loading: boolean) => void;
  setLoadingNewCustomers: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Dashboard Reports
  dashboardStats: null,
  revenueChartData: null,
  topProductsData: null,
  productPerformanceData: null,
  newCustomersData: null,
  
  // Loading States
  loadingDashboardStats: false,
  loadingRevenueChart: false,
  loadingTopProducts: false,
  loadingProductPerformance: false,
  loadingNewCustomers: false,
  
  // Actions
  setDashboardStats: (data) => set({ dashboardStats: data }),
  setRevenueChartData: (data) => set({ revenueChartData: data }),
  setTopProductsData: (data) => set({ topProductsData: data }),
  setProductPerformanceData: (data) => set({ productPerformanceData: data }),
  setNewCustomersData: (data) => set({ newCustomersData: data }),
  
  setLoadingDashboardStats: (loading) => set({ loadingDashboardStats: loading }),
  setLoadingRevenueChart: (loading) => set({ loadingRevenueChart: loading }),
  setLoadingTopProducts: (loading) => set({ loadingTopProducts: loading }),
  setLoadingProductPerformance: (loading) => set({ loadingProductPerformance: loading }),
  setLoadingNewCustomers: (loading) => set({ loadingNewCustomers: loading }),
})); 