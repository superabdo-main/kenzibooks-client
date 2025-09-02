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
import { Building2 } from "lucide-react";
import SupplierForm from "@/components/suppliers/supplier-form";

const NewSupplierPage = () => {
  const t = useTranslations("Suppliers");


  return (
    <div className="container mx-auto">

      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("newSupplier.title")}
            </CardTitle>
          </div>
          <CardDescription className="pt-1.5">
            {t("newSupplier.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SupplierForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSupplierPage; 