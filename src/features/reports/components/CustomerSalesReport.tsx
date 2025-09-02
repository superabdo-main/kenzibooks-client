"use client";

import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CustomerSalesReport } from "@/types/reports.type";
import { Skeleton } from "@/components/shadcn-ui/skeleton";

interface CustomerSalesReportProps {
  report: CustomerSalesReport | null;
  isLoading: boolean;
}

export function CustomerSalesReport({ report, isLoading }: CustomerSalesReportProps) {
  const t = useTranslations("Reports");

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!report || !report.topCustomers || report.topCustomers.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        {t("noDataAvailable")}
      </div>
    );
  }

  // Prepare data for the chart - limit to top 5 for better visualization if there are more
  const chartData = report.topCustomers
    .slice(0, 5)
    .map(customer => ({
      name: customer.name,
      amount: customer.totalAmount,
      count: customer.salesCount
    }));

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            barSize={30}
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
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => t("customer") + ": " + label}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              name={t("totalPurchases")} 
              fill="hsl(var(--chart-1))" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("topCustomersDetails")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">{t("customer")}</th>
                <th className="text-left py-2 pr-4">{t("email")}</th>
                <th className="text-right py-2 pr-4">{t("orderCount")}</th>
                <th className="text-right py-2">{t("totalPurchases")}</th>
              </tr>
            </thead>
            <tbody>
              {report.topCustomers.map((customer, index) => (
                <tr key={customer.id} className={`border-b ${index === 0 ? "bg-muted/30" : ""}`}>
                  <td className="py-2 pr-4 font-medium">
                    {index === 0 && <span className="inline-block text-xs bg-primary text-primary-foreground rounded-sm px-1 mr-1">#1</span>}
                    {customer.name}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{customer.email}</td>
                  <td className="text-right py-2 pr-4">{customer.salesCount}</td>
                  <td className="text-right py-2 font-bold">${customer.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 