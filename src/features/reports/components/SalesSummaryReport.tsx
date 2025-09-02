"use client";

import { useTranslations } from "next-intl";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { SalesSummaryReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface SalesSummaryReportProps {
  report: SalesSummaryReport | null;
  isLoading: boolean;
}

export function SalesSummaryReport({ report, isLoading }: SalesSummaryReportProps) {
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
  const salesByTypeData = report.salesByType.map(item => ({
    name: item.type,
    value: item._sum.grandTotal,
    count: item._count.id
  }));

  const salesByStatusData = report.salesByStatus.map(item => ({
    name: item.status,
    value: item._sum.grandTotal,
    count: item._count.id
  }));

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
          <h3 className="text-lg font-semibold">{t("salesByType")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                  labelFormatter={(label) => t(`saleType${label}`)}
                />
                <Legend formatter={(value) => t(`saleType${value}`)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("salesByStatus")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                  labelFormatter={(label) => t(`status${label}`)}
                />
                <Legend formatter={(value) => t(`status${value}`)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">{t("salesSummary")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("totalSales")}</div>
            <div className="text-xl font-bold mt-1">{report.totals.count}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("subTotal")}</div>
            <div className="text-xl font-bold mt-1">${report.totals.subTotal.toLocaleString()}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("taxes")}</div>
            <div className="text-xl font-bold mt-1">${report.totals.taxes.toLocaleString()}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("discount")}</div>
            <div className="text-xl font-bold mt-1">${report.totals.discount.toLocaleString()}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-muted-foreground">{t("grandTotal")}</div>
            <div className="text-xl font-bold mt-1">${report.totals.grandTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold">{t("salesByTypeDetails")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">{t("type")}</th>
                <th className="text-left py-2 pr-4">{t("count")}</th>
                <th className="text-right py-2">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {salesByTypeData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 pr-4">{t(`saleType${item.name}`)}</td>
                  <td className="py-2 pr-4">{item.count}</td>
                  <td className="text-right py-2">${item.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 