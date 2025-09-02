"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "./chart-card";
import { RevenueChartReport } from "@/types/reports.type";

function currencyFormatter(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

interface RevenueChartProps {
  data: RevenueChartReport[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
  const t = useTranslations("Charts");
  const tDashboard = useTranslations("Dashboard");
  
  const chartData = useMemo(() => {
    if (isLoading || !data || data.length === 0) {
      // Return placeholder data when loading or no data
      return [
        { month: "Jan", revenue: 0, profit: 0 },
        { month: "Feb", revenue: 0, profit: 0 },
        { month: "Mar", revenue: 0, profit: 0 },
        { month: "Apr", revenue: 0, profit: 0 },
        { month: "May", revenue: 0, profit: 0 },
        { month: "Jun", revenue: 0, profit: 0 },
      ];
    }
    
    return data;
  }, [data, isLoading]);

  
  return (
    <ChartCard 
      title={t("revenue_profit")}
      subtitle={t("revenue_subtitle")}
      isLoading={isLoading}
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.1"/>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              className="text-xs text-muted-foreground"
              dy={10}
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
              }}
              formatter={(value: number) => [currencyFormatter(value), ""]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "12px" }}
              iconSize={12} 
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ 
                r: 6, 
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
                filter: "url(#shadow)" 
              }}
              name={t("revenue")}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorProfit)"
              activeDot={{ 
                r: 6, 
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
                filter: "url(#shadow)" 
              }}
              name={tDashboard("profit")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
} 

export default React.memo(RevenueChart);