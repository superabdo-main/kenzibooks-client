"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format, subMonths } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import { DatePickerWithRange } from "@/components/shadcn-ui/date-range-picker";

import {
  useProfitAndLossReport,
  useBalanceSheetReport,
  useCashFlowReport,
} from "@/features/reports/hooks/useFinancialReports";
import {
  useSalesSummaryReport,
  useTopProductsReport,
  useCustomerSalesReport,
} from "@/features/reports/hooks/useSalesReports";
import {
  useInventorySummaryReport,
  useLowStockReport,
} from "@/features/reports/hooks/useInventoryReports";
import { ProfitLossReport } from "@/features/reports/components/ProfitLossReport";
import { BalanceSheetReport } from "@/features/reports/components/BalanceSheetReport";
import { CashFlowReport } from "@/features/reports/components/CashFlowReport";
import { SalesSummaryReport } from "@/features/reports/components/SalesSummaryReport";
import { TopProductsReport } from "@/features/reports/components/TopProductsReport";
import { CustomerSalesReport } from "@/features/reports/components/CustomerSalesReport";
import { InventorySummaryReport } from "@/features/reports/components/InventorySummaryReport";
import { LowStockReport } from "@/features/reports/components/LowStockReport";
import {
  ChartBarIcon,
  DollarSignIcon,
  SquareStackIcon,
  BarChartIcon,
  BanknoteIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartPieIcon,
} from "lucide-react";

export default function ReportsPage() {
  const t = useTranslations("Reports");
  const [selectedTab, setSelectedTab] = useState("financial");
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [inventory, setInventory] = useState({
    threshold: 10,
  });

  // Format dates for API calls
  const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  // Load reports based on active tab
  const { profitAndLossReport, isLoading: loadingPL } = useProfitAndLossReport(
    startDate,
    endDate
  );
  const { balanceSheetReport, isLoading: loadingBS } = useBalanceSheetReport();
  const { cashFlowReport, isLoading: loadingCF } = useCashFlowReport(
    startDate,
    endDate
  );
  const { salesSummaryReport, isLoading: loadingSS } = useSalesSummaryReport(
    startDate,
    endDate
  );
  const { topProductsReport, isLoading: loadingTP } = useTopProductsReport(
    startDate,
    endDate,
    5
  );
  const { customerSalesReport, isLoading: loadingCS } = useCustomerSalesReport(
    startDate,
    endDate,
    10
  );
  const { inventorySummaryReport, isLoading: loadingIS } =
    useInventorySummaryReport();
  const { lowStockReport, isLoading: loadingLS } = useLowStockReport(
    inventory.threshold
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-in-out">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex items-center space-x-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline">{t("exportReport")}</Button>
        </div>
      </div>

      <Tabs
        defaultValue="financial"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="financial">
            <ChartBarIcon className="mr-2 h-4 w-4" />
            {t("financialReports")}
          </TabsTrigger>
          <TabsTrigger value="sales">
            <DollarSignIcon className="mr-2 h-4 w-4" />
            {t("salesReports")}
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <SquareStackIcon className="mr-2 h-4 w-4" />
            {t("inventoryReports")}
          </TabsTrigger>
        </TabsList>

        {/* Financial Reports Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("profitAndLoss")}
                </CardTitle>
                <CardDescription>{t("profitAndLossDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPL ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : profitAndLossReport ? (
                  <div className="text-2xl font-bold">
                    ${profitAndLossReport.netProfit.toLocaleString()}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("netProfit")}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BanknoteIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("balanceSheet")}
                </CardTitle>
                <CardDescription>{t("balanceSheetDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBS ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : balanceSheetReport ? (
                  <div className="text-2xl font-bold">
                    ${balanceSheetReport.assets.totalAssets.toLocaleString()}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("totalAssets")}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("cashFlow")}
                </CardTitle>
                <CardDescription>{t("cashFlowDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCF ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : cashFlowReport ? (
                  <div className="text-2xl font-bold">
                    ${cashFlowReport.netCashFlow.toLocaleString()}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("netCashFlow")}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("profitAndLoss")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfitLossReport
                  report={profitAndLossReport}
                  isLoading={loadingPL}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("balanceSheet")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BalanceSheetReport
                  report={balanceSheetReport}
                  isLoading={loadingBS}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("cashFlow")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CashFlowReport report={cashFlowReport} isLoading={loadingCF} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <DollarSignIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("salesSummary")}
                </CardTitle>
                <CardDescription>{t("salesSummaryDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSS ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : salesSummaryReport ? (
                  <div className="text-2xl font-bold">
                    ${salesSummaryReport.totals.grandTotal.toLocaleString()}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("totalSales")}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ShoppingBagIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("topProducts")}
                </CardTitle>
                <CardDescription>{t("topProductsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTP ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : topProductsReport?.topProducts &&
                  topProductsReport.topProducts.length > 0 ? (
                  <div className="text-lg font-bold">
                    {topProductsReport.topProducts[0].name}
                    <div className="text-xs font-normal text-muted-foreground">
                      $
                      {topProductsReport.topProducts[0].totalSales.toLocaleString()}{" "}
                      {t("inSales")}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("customers")}
                </CardTitle>
                <CardDescription>{t("customersDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCS ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : customerSalesReport?.topCustomers &&
                  customerSalesReport.topCustomers.length > 0 ? (
                  <div className="text-lg font-bold">
                    {customerSalesReport.topCustomers[0].name}
                    <div className="text-xs font-normal text-muted-foreground">
                      $
                      {customerSalesReport.topCustomers[0].totalAmount.toLocaleString()}{" "}
                      {t("inPurchases")}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("salesSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesSummaryReport
                  report={salesSummaryReport}
                  isLoading={loadingSS}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("topSellingProducts")}</CardTitle>
              </CardHeader>
              <CardContent>
                <TopProductsReport
                  report={topProductsReport}
                  isLoading={loadingTP}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("topCustomers")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerSalesReport
                  report={customerSalesReport}
                  isLoading={loadingCS}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Reports Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <SquareStackIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("inventory")}
                </CardTitle>
                <CardDescription>{t("inventoryDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingIS ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                ) : inventorySummaryReport ? (
                  <div className="text-2xl font-bold">
                    {inventorySummaryReport.totalInventory.productCount}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("products")}
                    </span>
                    <div className="text-xs font-normal text-muted-foreground">
                      $
                      {inventorySummaryReport.totalInventory.retailValue.toLocaleString()}{" "}
                      {t("value")}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ChartPieIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {t("lowStock")}
                </CardTitle>
                <CardDescription>{t("lowStockDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <Select
                    defaultValue="10"
                    value={inventory.threshold.toString()}
                    onValueChange={(value) =>
                      setInventory({ ...inventory, threshold: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    {t("threshold")}
                  </span>
                </div>
                {loadingLS ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                  </div>
                ) : lowStockReport ? (
                  <div className="text-2xl font-bold">
                    {lowStockReport.count}
                    <span className="text-xs ml-2 font-normal text-muted-foreground">
                      {t("itemsLowStock")}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("inventorySummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <InventorySummaryReport
                  report={inventorySummaryReport}
                  isLoading={loadingIS}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("lowStockItems")}</CardTitle>
              </CardHeader>
              <CardContent>
                <LowStockReport
                  report={lowStockReport}
                  isLoading={loadingLS}
                  threshold={inventory.threshold}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
