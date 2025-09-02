"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { InventorySummaryReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn-ui/tabs";

interface InventorySummaryReportProps {
  report: InventorySummaryReport | null;
  isLoading: boolean;
}

export function InventorySummaryReport({ report, isLoading }: InventorySummaryReportProps) {
  const t = useTranslations("Reports");

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        {t("noDataAvailable")}
      </div>
    );
  }

  // Prepare data for the charts
  const categoryData = report.inventoryByCategory.map(item => ({
    name: item.category.name,
    value: item.costValue,
    products: item.productCount,
    quantity: item.totalQuantity,
    retail: item.retailValue,
    profit: item.potentialProfit
  }));

  const warehouseData = report.inventoryByWarehouse.map(item => ({
    name: item.warehouse.name,
    value: item.costValue,
    products: item.productCount,
    quantity: item.totalQuantity,
    retail: item.retailValue,
    profit: item.potentialProfit
  }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-background border">
          <div className="text-sm font-medium text-muted-foreground">{t("totalProducts")}</div>
          <div className="text-2xl font-bold">{report.totalInventory.productCount}</div>
        </div>
        
        <div className="p-4 rounded-lg bg-background border">
          <div className="text-sm font-medium text-muted-foreground">{t("inventoryCost")}</div>
          <div className="text-2xl font-bold">${report.totalInventory.costValue.toLocaleString()}</div>
        </div>
        
        <div className="p-4 rounded-lg bg-background border">
          <div className="text-sm font-medium text-muted-foreground">{t("retailValue")}</div>
          <div className="text-2xl font-bold">${report.totalInventory.retailValue.toLocaleString()}</div>
        </div>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="categories">{t("byCategory")}</TabsTrigger>
          <TabsTrigger value="warehouses">{t("byWarehouse")}</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {categoryData.length > 0 ? (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">{t("category")}</th>
                      <th className="text-right py-2 pr-4">{t("products")}</th>
                      <th className="text-right py-2 pr-4">{t("quantity")}</th>
                      <th className="text-right py-2 pr-4">{t("costValue")}</th>
                      <th className="text-right py-2 pr-4">{t("retailValue")}</th>
                      <th className="text-right py-2">{t("potentialProfit")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 pr-4 font-medium">{item.name}</td>
                        <td className="text-right py-2 pr-4">{item.products}</td>
                        <td className="text-right py-2 pr-4">{item.quantity}</td>
                        <td className="text-right py-2 pr-4">${item.value.toLocaleString()}</td>
                        <td className="text-right py-2 pr-4">${item.retail.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">${item.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td className="py-2 pr-4">{t("total")}</td>
                      <td className="text-right py-2 pr-4">{report.totalInventory.productCount}</td>
                      <td className="text-right py-2 pr-4">{report.totalInventory.totalQuantity}</td>
                      <td className="text-right py-2 pr-4">${report.totalInventory.costValue.toLocaleString()}</td>
                      <td className="text-right py-2 pr-4">${report.totalInventory.retailValue.toLocaleString()}</td>
                      <td className="text-right py-2">${report.totalInventory.potentialProfit.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t("noCategories")}</div>
          )}
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          {warehouseData.length > 0 ? (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={warehouseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="value" name={t("costValue")} fill="hsl(var(--chart-1))" />
                    <Bar dataKey="retail" name={t("retailValue")} fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">{t("warehouse")}</th>
                      <th className="text-right py-2 pr-4">{t("products")}</th>
                      <th className="text-right py-2 pr-4">{t("quantity")}</th>
                      <th className="text-right py-2 pr-4">{t("costValue")}</th>
                      <th className="text-right py-2 pr-4">{t("retailValue")}</th>
                      <th className="text-right py-2">{t("potentialProfit")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouseData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 pr-4 font-medium">{item.name}</td>
                        <td className="text-right py-2 pr-4">{item.products}</td>
                        <td className="text-right py-2 pr-4">{item.quantity}</td>
                        <td className="text-right py-2 pr-4">${item.value.toLocaleString()}</td>
                        <td className="text-right py-2 pr-4">${item.retail.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">${item.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td className="py-2 pr-4">{t("total")}</td>
                      <td className="text-right py-2 pr-4">{report.totalInventory.productCount}</td>
                      <td className="text-right py-2 pr-4">{report.totalInventory.totalQuantity}</td>
                      <td className="text-right py-2 pr-4">${report.totalInventory.costValue.toLocaleString()}</td>
                      <td className="text-right py-2 pr-4">${report.totalInventory.retailValue.toLocaleString()}</td>
                      <td className="text-right py-2">${report.totalInventory.potentialProfit.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t("noWarehouses")}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 