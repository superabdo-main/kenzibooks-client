"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../shadcn-ui/card";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function ChartCard({ title, subtitle, children, isLoading = false }: ChartCardProps) {
  return (
    <Card className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-sm">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : children}
      </CardContent>
    </Card>
  );
} 