"use client";

import React, { useState } from "react";
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
import { FolderIcon, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRunningExpenses } from "@/features/expenses/hooks/useRunningExpenses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import ExpenseForm from "@/features/expenses/forms/create-form";
import { useExpenseStore } from "@/stores/expenses.store";

const ExpensesPage = () => {
  const { session } = useAuth();
  const t = useTranslations("Expenses");
  const { expenses, isLoading, mutate } = useRunningExpenses();
  const { toast } = useToast();
  const [createDialog, setCreateDialog] = useState(false);
  const { deleteExpense } = useExpenseStore();

  const handleDeleteExpense = async (id: string) => {
    if (!session?.accessToken) return;
    const response = await deleteExpense({
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
      description: "Expense deleted successfully",
    });
    // return Promise.resolve();
  };

  // Create columns with translations
  const columns = createColumns(t, handleDeleteExpense);

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
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">
              {t("form.title")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("form.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ExpenseForm onCancel={() => setCreateDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border flex w-full justify-between flex-row">
          <div>
            <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
              <FolderIcon className="h-5 w-5 text-red-500" />
              <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                {t("runningExpenses.title")}
              </CardTitle>
            </div>
            <CardDescription className="pt-1.5">
              {t("runningExpenses.subtitle")}
            </CardDescription>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 bg-background border-border hover:bg-muted/50"
              onClick={() => setCreateDialog(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("table.new")}
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
              data={expenses || []}
              searchColumn="reference"
              translations={tableTranslations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
