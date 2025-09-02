"use client";

import { useTranslations } from "next-intl";
import { LowStockReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LowStockReportProps {
  report: LowStockReport | null;
  isLoading: boolean;
  threshold: number;
}

export function LowStockReport({ report, isLoading, threshold }: LowStockReportProps) {
  const t = useTranslations("Reports");

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!report || !report.products || report.products.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        {t("noLowStockItems")}
      </div>
    );
  }

  // Prepare data for the chart - show top 10 products with lowest stock
  const chartData = report.products
    .slice(0, 10)
    .map(product => ({
      name: product.name,
      quantity: product.quantity,
      // Calculate stock level as percentage of threshold
      stockLevel: Math.round((product.quantity / threshold) * 100)
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t("lowStockItems")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("showingItemsBelow")} {threshold} {t("units")}
          </p>
        </div>
        <div className="text-xl font-bold">
          {report.count} {t("items")}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, threshold]} />
              <YAxis 
                type="category"
                dataKey="name" 
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [value, t("quantity")]}
              />
              <Legend />
              <Bar 
                dataKey="quantity" 
                name={t("stockLevel")}
                fill={(entry) => {
                  const level = entry.stockLevel;
                  if (level <= 20) return "hsl(var(--destructive))";
                  if (level <= 50) return "hsl(var(--warning))";
                  return "hsl(var(--chart-1))";
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4">{t("product")}</th>
              <th className="text-left py-2 pr-4">{t("sku")}</th>
              <th className="text-left py-2 pr-4">{t("category")}</th>
              <th className="text-left py-2 pr-4">{t("warehouse")}</th>
              <th className="text-right py-2 pr-4">{t("quantity")}</th>
              <th className="text-right py-2">{t("value")}</th>
            </tr>
          </thead>
          <tbody>
            {report.products.map((product) => {
              // Calculate stock level for styling
              const stockLevel = Math.round((product.quantity / threshold) * 100);
              let stockClass = "";
              
              if (stockLevel <= 20) {
                stockClass = "text-destructive font-bold";
              } else if (stockLevel <= 50) {
                stockClass = "text-amber-500";
              }
              
              return (
                <tr key={product.id} className="border-b">
                  <td className="py-2 pr-4 font-medium">{product.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{product.sku || "-"}</td>
                  <td className="py-2 pr-4">{product.category?.name || t("uncategorized")}</td>
                  <td className="py-2 pr-4">{product.warehouse?.name || t("noWarehouse")}</td>
                  <td className={`text-right py-2 pr-4 ${stockClass}`}>
                    {product.quantity}
                  </td>
                  <td className="text-right py-2">
                    ${(product.quantity * product.purchasePrice).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-muted-foreground pt-4">
        <p>
          {t("lowStockDescription")}
        </p>
      </div>
    </div>
  );
} 