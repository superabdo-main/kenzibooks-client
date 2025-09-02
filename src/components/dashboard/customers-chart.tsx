"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn-ui/chart";

import { NewCustomersReport } from "@/types/reports.type";

interface CustomersChartProps {
  data: NewCustomersReport[];
  isLoading?: boolean;
}

export function CustomersChart({ data, isLoading = false }: CustomersChartProps) {
  const t = useTranslations("Charts");
   
  const chartData = useMemo(() => {
    if (isLoading || !data || data.length === 0) {
      // Return placeholder data when loading or no data
      return [
        { month: "January", new: 0 },
        { month: "February", new: 0 },
        { month: "March", new: 0 },
        { month: "April", new: 0 },
        { month: "May", new: 0 },
        { month: "June", new: 0 },
      ];
    }
    
    return data;
  }, [data, isLoading]);

  const chartConfig = {
    new: {
      label: t("new_customers"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold tracking-tight">{t("new_customers")}</CardTitle>
        <CardDescription className="text-sm">{t("new_customers_period")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 3)}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="new"
                type="monotone"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                fill="url(#colorNew)"
                dot={{
                  fill: "hsl(var(--chart-1))",
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t px-6 py-4 bg-muted/10">
        <div className="flex gap-2 font-medium text-emerald-600 dark:text-emerald-400 items-center">
          <TrendingUp className="h-4 w-4" />
          {t("customer_trend")}
        </div>
        <div className="leading-relaxed text-muted-foreground text-sm">
          {t("customer_summary")}
        </div>
      </CardFooter>
    </Card>
  );
}
