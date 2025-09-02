"use client";

import React from "react";
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
import { ShoppingBag, PlusIcon } from "lucide-react";
import { useSalesStore } from "@/stores/sales.store";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import {
  exportSalesToCSV,
  exportSalesToExcel,
  exportSalesToPDF,
} from "@/lib/export/sales";
import { useSales } from "@/features/sales/hooks/useSales";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SalesPage = () => {
  const t = useTranslations("EstimatedSale");
  const { sales, isLoading, mutate } = useSales({ type: "ESTIMATED_SALE" });
  const { deleteSaleById } = useSalesStore();
  const { session } = useAuth();
  const { toast } = useToast();

  const handleDeleteSale = async (id: string) => {
    if (!session?.accessToken) return;
    const response = await deleteSaleById({
      accessToken: session.accessToken,
      id,
    });
    if (response.error) {
      toast({
        title: "Estimated Sale not found",
        description: "The requested estimated sale could not be found.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Estimated Sale deleted",
      description: "The estimated sale has been deleted successfully.",
      variant: "default",
    });
    mutate();
  };

  // Create columns with translations
  const columns = createColumns(t, handleDeleteSale);

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
    <div className="container mx-auto">
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border flex w-full justify-between flex-row">
          <div>
            <div className="flex items-center gap-2 border-l-4 border-pink-500 pl-2">
              <ShoppingBag className="h-5 w-5 text-pink-500" />
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
              <Link href={`/dashboard/estimated-sale/new-estimated-sale`}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("table.new")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-80" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-1">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-muted/40">
                    {Array(6)
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
                        className="grid grid-cols-6 gap-4 p-4 border-t"
                      >
                        {Array(6)
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
              data={sales || []}
              searchColumn="customerEmail"
              translations={tableTranslations}
              onExportPDF={() => exportSalesToPDF(sales || [], t)}
              onExportExcel={() => exportSalesToExcel(sales || [], t)}
              onExportCSV={() => exportSalesToCSV(sales || [], t)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
