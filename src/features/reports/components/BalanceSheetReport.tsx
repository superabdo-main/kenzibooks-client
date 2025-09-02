"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BalanceSheetReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface BalanceSheetReportProps {
  report: BalanceSheetReport | null;
  isLoading: boolean;
}

export function BalanceSheetReport({ report, isLoading }: BalanceSheetReportProps) {
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
  const assetData = [
    { name: t("inventory"), value: report.assets.inventory },
    { name: t("fixedAssets"), value: report.assets.fixedAssets },
  ];

  const liabilityEquityData = [
    { name: t("liabilities"), value: report.liabilities.totalLiabilities },
    { name: t("equity"), value: report.equity },
  ];

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("assets")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
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
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("liabilitiesAndEquity")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={liabilityEquityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liabilityEquityData.map((entry, index) => (
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("assets")}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("inventory")}</span>
              <span className="font-medium">${report.assets.inventory.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fixedAssets")}</span>
              <span className="font-medium">${report.assets.fixedAssets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>{t("totalAssets")}</span>
              <span>${report.assets.totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("liabilitiesAndEquity")}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("accountsPayable")}</span>
              <span className="font-medium">${report.liabilities.accountsPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>{t("totalLiabilities")}</span>
              <span>${report.liabilities.totalLiabilities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("equity")}</span>
              <span className="font-medium">${report.equity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>{t("totalLiabilitiesEquity")}</span>
              <span>${(report.liabilities.totalLiabilities + report.equity).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 