"use client";

import { useTranslations } from "next-intl";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CashFlowReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface CashFlowReportProps {
  report: CashFlowReport | null;
  isLoading: boolean;
}

export function CashFlowReport({ report, isLoading }: CashFlowReportProps) {
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

  // Prepare data for the chart - simplified with just a single point since we don't have time-series data
  const chartData = [
    { name: t("period"), inflow: report.cashInflow, outflow: report.cashOutflow, netFlow: report.netCashFlow },
  ];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
            <Legend />
            <Area type="monotone" dataKey="inflow" name={t("cashInflow")} stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1)/0.3)" />
            <Area type="monotone" dataKey="outflow" name={t("cashOutflow")} stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4)/0.3)" />
            <Area type="monotone" dataKey="netFlow" name={t("netCashFlow")} stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2)/0.3)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("cashFlowSummary")}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("cashInflow")}</div>
            <div className="text-2xl font-bold">${report.cashInflow.toLocaleString()}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("cashOutflow")}</div>
            <div className="text-2xl font-bold">${report.cashOutflow.toLocaleString()}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("netCashFlow")}</div>
            <div className={`text-2xl font-bold ${report.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${report.netCashFlow.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="text-sm text-muted-foreground">
            {report.netCashFlow >= 0
              ? t("positiveNetCashDescription")
              : t("negativeNetCashDescription")}
          </div>
        </div>
      </div>
    </div>
  );
} 