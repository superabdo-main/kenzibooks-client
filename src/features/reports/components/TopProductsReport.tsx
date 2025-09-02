"use client";

import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TopProductsReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface TopProductsReportProps {
  report: TopProductsReport | null;
  isLoading: boolean;
}

export function TopProductsReport({ report, isLoading }: TopProductsReportProps) {
  const t = useTranslations("Reports");

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!report || !report.topProducts || report.topProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        {t("noDataAvailable")}
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = report.topProducts.map(product => ({
    name: product.name,
    sales: product.totalSales,
    quantity: product.quantitySold,
  }));

  const maxSales = Math.max(...chartData.map(item => item.sales));
  const maxQuantity = Math.max(...chartData.map(item => item.quantity));

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={0}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={[0, maxSales * 1.2]} // Add some space above max value
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => value.toString()}
              domain={[0, maxQuantity * 1.2]} // Add some space above max value
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === t("salesAmount")) {
                  return [`$${value.toLocaleString()}`, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="sales" 
              name={t("salesAmount")} 
              fill="hsl(var(--chart-1))"
            />
            <Bar 
              yAxisId="right"
              dataKey="quantity" 
              name={t("quantity")} 
              fill="hsl(var(--chart-2))" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("topSellingProductsDetails")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">{t("product")}</th>
                <th className="text-left py-2 pr-4">{t("sku")}</th>
                <th className="text-right py-2 pr-4">{t("unitPrice")}</th>
                <th className="text-right py-2 pr-4">{t("quantity")}</th>
                <th className="text-right py-2">{t("totalSales")}</th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts.map((product, index) => (
                <tr key={product.id} className={`border-b ${index === 0 ? "bg-muted/30" : ""}`}>
                  <td className="py-2 pr-4 font-medium">
                    {index === 0 && <span className="inline-block text-xs bg-primary text-primary-foreground rounded-sm px-1 mr-1">#1</span>}
                    {product.name}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{product.sku || "-"}</td>
                  <td className="text-right py-2 pr-4">${product.salePrice.toLocaleString()}</td>
                  <td className="text-right py-2 pr-4">{product.quantitySold}</td>
                  <td className="text-right py-2 font-medium">${product.totalSales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 