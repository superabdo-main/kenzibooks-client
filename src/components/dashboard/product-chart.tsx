"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "./chart-card";
import { ProductPerformanceReport } from "@/types/reports.type";

interface ProductChartProps {
  data: ProductPerformanceReport[];
  isLoading?: boolean;
}

export function ProductChart({ data, isLoading = false }: ProductChartProps) {
  const t = useTranslations("Charts");
  
  const chartData = useMemo(() => {
    if (isLoading || !data || data.length === 0) {
      // Return placeholder data when loading or no data
      return [
        { name: "No Data", sales: 0, revenue: 0 }
      ];
    }
    
    return data;
  }, [data, isLoading]);
  
  return (
    <ChartCard 
      title={t("product_performance")}
      subtitle={t("product_subtitle")}
      isLoading={isLoading}
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barGap={8}
            barSize={22}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              className="text-xs text-muted-foreground"
              dy={10} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              className="text-xs text-muted-foreground"
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "12px" }}
              iconSize={10}
              iconType="circle"
            />
            <Bar 
              dataKey="sales" 
              fill="url(#salesGradient)" 
              radius={[4, 4, 0, 0]} 
              name={t("sales")}
            />
            <Bar 
              dataKey="revenue" 
              fill="url(#revenueGradient)" 
              radius={[4, 4, 0, 0]} 
              name={t("revenue")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
} 