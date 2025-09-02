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
import { PlusIcon, ReceiptIcon } from "lucide-react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { useTaxes } from "@/features/taxes/hooks/useTaxes";
import { useTaxStore } from "@/stores/tax.store";
import { TaxCreateForm } from "@/features/taxes/forms/create-form";

const SalesTaxPage = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const t = useTranslations("SalesTax");
  const { taxes, isLoading, mutate } = useTaxes();
  const { toast } = useToast();
  const [createDialog, setCreateDialog] = React.useState(false);

  const { deleteTax } = useTaxStore();

  const handleDeleteTax = async (id: string) => {
    if (!session?.accessToken) return;
    const response = await deleteTax({
      id,
      accessToken: session?.accessToken,
    });
    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
      return;
    }
    mutate();
    toast({
      variant: "default",
      title: "Success",
      description: "Tax deleted successfully",
    });
    return Promise.resolve();
  };

  // Create columns with translations
  const columns = createColumns(t, handleDeleteTax);

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
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> {t("actions.new")}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-6">
          <div className="flex items-center">
            <ReceiptIcon className="mr-4 h-6 w-6" />
            <div>
              <CardTitle>{t("cardTitle")}</CardTitle>
              <CardDescription>{t("cardDescription")}</CardDescription>
            </div>
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
                  <div className="grid grid-cols-5 gap-4 p-4 bg-muted/40">
                    {Array(5)
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
                        className="grid grid-cols-5 gap-4 p-4 border-t"
                      >
                        {Array(5)
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
              data={taxes || []}
              searchColumn="name"
              translations={tableTranslations}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Tax Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("form.title")}</DialogTitle>
            <DialogDescription>
              {t("form.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <TaxCreateForm onCancel={() => setCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesTaxPage; 