"use client";

import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ProfitAndLossReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface ProfitLossReportProps {
  report: ProfitAndLossReport | null;
  isLoading: boolean;
}

export function ProfitLossReport({ report, isLoading }: ProfitLossReportProps) {
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

  // Prepare data for the chart
  const chartData = [
    { name: t("revenue"), amount: report.revenue },
    { name: t("costOfGoodsSold"), amount: -report.costOfGoodsSold },
    { name: t("grossProfit"), amount: report.grossProfit },
    { name: t("expenses"), amount: -report.expenses },
    { name: t("netProfit"), amount: report.netProfit },
  ];

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${Math.abs(value).toLocaleString()}`, ""]}
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              name={t("amount")}
              fill={(entry) => entry.amount >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-4))"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{t("revenue")}</div>
            <div className="text-2xl font-bold">${report.revenue.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{t("costOfGoodsSold")}</div>
            <div className="text-2xl font-bold">${report.costOfGoodsSold.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{t("grossProfit")}</div>
            <div className="text-2xl font-bold">${report.grossProfit.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{t("expenses")}</div>
            <div className="text-2xl font-bold">${report.expenses.toLocaleString()}</div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">{t("netProfit")}</div>
            <div className="text-2xl font-bold">${report.netProfit.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 