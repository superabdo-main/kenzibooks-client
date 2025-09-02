"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Users, DollarSign, Store, Receipt } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopProductsChart } from "@/components/dashboard/topProducts-chart";
import { ProductChart } from "@/components/dashboard/product-chart";
import { CustomersChart } from "@/components/dashboard/customers-chart";

import {
  useDashboardStats,
  useRevenueChart,
  useTopProductsChart,
  useProductPerformance,
  useNewCustomersChart
} from "@/features/dashboard/hooks/useDashboardReports";

const Dashboard = () => {
  const t = useTranslations("Dashboard");

  // Fetch dashboard data
  const { dashboardStats, isLoading: loadingStats } = useDashboardStats();
  const { revenueChartData, isLoading: loadingRevenue } = useRevenueChart();
  const { topProductsData, isLoading: loadingTopProducts } = useTopProductsChart();
  const { productPerformanceData, isLoading: loadingProductPerformance } = useProductPerformance();
  const { newCustomersData, isLoading: loadingCustomers } = useNewCustomersChart();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-in-out">
      <div className="">
        <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 ">
        <StatCard
          title={t("profit")}
          value={loadingStats ? "Loading..." : formatCurrency(dashboardStats?.profit.value || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: dashboardStats?.profit.trend || 0, isPositive: (dashboardStats?.profit.trend || 0) > 0 }}
          isLoading={loadingStats}
        />
        <StatCard
          title={t("total_sales")}
          value={loadingStats ? "Loading..." : formatCurrency(dashboardStats?.totalSales.value || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: dashboardStats?.totalSales.trend || 0, isPositive: (dashboardStats?.totalSales.trend || 0) > 0 }}
          isLoading={loadingStats}
        />
        <StatCard
          title={t("total_purchase")}
          value={loadingStats ? "Loading..." : formatCurrency(dashboardStats?.totalPurchase.value || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: dashboardStats?.totalPurchase.trend || 0, isPositive: (dashboardStats?.totalPurchase.trend || 0) > 0 }}
          isLoading={loadingStats}
        />
      </div>
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 ">
        <StatCard
          title={t("products")}
          value={loadingStats ? "Loading..." : dashboardStats?.products.value.toString() || "0"}
          icon={<Store className="h-5 w-5" />}
          isLoading={loadingStats}
        />
        <StatCard
          title={t("invoices")}
          value={loadingStats ? "Loading..." : dashboardStats?.invoices.value.toString() || "0"}
          icon={<Receipt className="h-5 w-5" />}
          isLoading={loadingStats}
        />
        <StatCard
          title={t("customers")}
          value={loadingStats ? "Loading..." : dashboardStats?.customers.value.toString() || "0"}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: dashboardStats?.customers.trend || 0, isPositive: (dashboardStats?.customers.trend || 0) > 0 }}
          isLoading={loadingStats}
        />
      </div>

      {/* Revenue Chart */}
      <div className="">
        <RevenueChart data={revenueChartData || []} isLoading={loadingRevenue} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 ">
        {/* Traffic sources chart */}
        <TopProductsChart data={topProductsData || []} isLoading={loadingTopProducts} />

        {/* Products sales chart */}
        <ProductChart data={productPerformanceData || []} isLoading={loadingProductPerformance} />
      </div>

      <div className="">
        <CustomersChart data={newCustomersData || []} isLoading={loadingCustomers} />
      </div>
    </div>
  );
};

export default Dashboard;
