"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ChartConfig, ChartContainer, ChartTooltipContent } from "../shadcn-ui/chart";
import { ChartCard } from "./chart-card";
import { DashboardTopProductsReport } from "@/types/reports.type";

interface TopProductsChartProps {
  data: DashboardTopProductsReport[];
  isLoading?: boolean;
}

export function TopProductsChart({ data, isLoading = false }: TopProductsChartProps) {
  const t = useTranslations("Charts");

  const chartData = useMemo(() => {
    if (isLoading || !data || data.length === 0) {
      // Return placeholder data when loading or no data
      return [
        { name: "No Data", value: 100 }
      ];
    }
    
    return data;
  }, [data, isLoading]);
  
  const COLORS = useMemo(() => [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ], []);
  
  const chartConfig = useMemo(() => ({
  } satisfies ChartConfig), []);

  return (
    <ChartCard 
      title={t("top_products")} 
      subtitle={t("traffic_distribution")}
      isLoading={isLoading}
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>

          <PieChart>
            <defs>
              <filter id="pieGlow" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodOpacity="0.1"/>
              </filter>
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={3}
              filter="url(#pieGlow)"
              animationDuration={1500}
              animationBegin={300}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              content={<ChartTooltipContent hideLabel />}
              animationDuration={300}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
              }}
            />
            <Legend 
              formatter={(value, entry, index) => (
                <span className="text-xs font-medium">
                  {value} - {chartData[index]?.value}
                </span>
              )}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
              </ChartContainer>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
} 

export default React.memo(TopProductsChart);