"use client";

import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../shadcn-ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export function StatCard({ title, value, icon, trend, isLoading = false }: StatCardProps) {
  const formattedTrend = trend ? Math.abs(trend.value * 100).toFixed(1) : '';
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-muted/30 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {isLoading ? (
          <div className="h-8 w-24 bg-muted/30 animate-pulse rounded-md"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
      {trend && (
        <CardFooter className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1 text-red-500" />
            )}
            <span className={trend.isPositive ? "text-emerald-500" : "text-red-500"}>
              {formattedTrend}%
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 