"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { User } from "lucide-react";
import { EmployeeForm } from "@/features/payrolls/employees/form";

const NewEmployeePage = () => {
  const t = useTranslations("Employee");


  return (
    <div className="container mx-auto">

      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-teal-500 pl-2">
            <User className="h-5 w-5 text-teal-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("createEmployee.title")}
            </CardTitle>
          </div>
          <CardDescription className="pt-1.5">
            {t("createEmployee.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEmployeePage; 