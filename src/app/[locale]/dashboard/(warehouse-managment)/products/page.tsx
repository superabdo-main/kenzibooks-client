"use client";

import React, { useEffect } from "react";
import { createColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { useTranslations } from "next-intl";
import { PackageIcon, PlusIcon } from "lucide-react";
import { useProductsStore } from "@/stores/products.store";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import {
  exportProductsToPDF,
  exportProductsToExcel,
  exportProductsToCSV,
} from "@/lib/export/products";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

const ProductsPage = () => {
  const t = useTranslations("Products");
  useProductsStore();
  const { products, isLoading, mutate } = useProducts();
  const { session } = useAuth();
  const { deleteProduct } = useProductsStore();
  const {managedOrganization} = useManagementStore()

  const handleDeleteProduct = async (id: string) => {
    if (session) {
      await deleteProduct({
        productId: id,
        accessToken: session?.accessToken || "",
        organizationId: managedOrganization?.id || "",
      });
      mutate()
    }
  };

  // Create columns with translations
  const columns = createColumns(t, handleDeleteProduct);

  // Create translations for data table components
  const tableTranslations = {
    noResults: t("table.noResults"),
    toolbar: {
      new: t("table.new"),
      search: t("table.searchPlaceholder"),
      filters: t("table.filters"),
      filterColumns: t("table.filterColumns"),
      reset: t("table.reset"),
      print: t("table.print"),
      export: t("table.export"),
      excel: t("table.excel"),
      csv: t("table.csv"),
      pdf: t("table.pdf"),
    },
    pagination: {
      rowsSelected: t("table.rowsSelected"),
      rowsPerPage: t("table.rowsPerPage"),
      page: t("table.page"),
      of: t("table.of"),
      firstPage: t("table.firstPage"),
      previousPage: t("table.previousPage"),
      nextPage: t("table.nextPage"),
      lastPage: t("table.lastPage"),
    },
  };

  return (
    <div className="container mx-auto ">
      {/* <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div> */}

      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border flex w-full justify-between flex-row">
          <div className="">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <PackageIcon className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                {t("title")}
              </CardTitle>
            </div>
            <CardDescription className="pt-1.5">
              {t("subtitle")}
            </CardDescription>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 bg-background border-border hover:bg-muted/50"
              asChild
            >
              <Link href={"/dashboard/products/new-product"}>
                <PlusIcon />
                {t("table.new")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-80" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-1">
                  <div className="grid grid-cols-8 gap-4 p-4 bg-muted/40">
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-6" />
                      ))}
                  </div>

                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-8 gap-4 p-4 border-t"
                      >
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <Skeleton key={j} className="h-6" />
                          ))}
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-64" />
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={products || []}
              searchColumn="name"
              translations={tableTranslations}
              onExportPDF={() => exportProductsToPDF(products || [], t)}
              onExportExcel={() => exportProductsToExcel(products || [], t)}
              onExportCSV={() => exportProductsToCSV(products || [], t)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
