"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { useTranslations } from "next-intl";
import { DollarSign, Plus } from "lucide-react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRevenue } from "@/features/revenue/hooks/useRevenue";
import { RevenueTable } from "@/components/revenue/RevenueTable";
import { RevenueModal } from "@/components/revenue/RevenueModal";

const RevenuePage = () => {
  const { session } = useAuth();
  const t = useTranslations("Revenue");
  const { revenues, isLoading, deleteRevenue, refreshRevenues } = useRevenue();
  const { toast } = useToast();

  const handleDeleteRevenue = async (id: string) => {
    if (!session?.accessToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication required",
      });
      return;
    }

    try {
      const response = await deleteRevenue(id);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return;
      }
      
      toast({
        variant: "default",
        title: "Success",
        description: "Revenue deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete revenue. Please try again.",
      });
    }
  };

  const handleRevenueCreated = () => {
    refreshRevenues();
  };

  // Create translations for data table components
  const tableTranslations = {
    noResults: t("table.noResults") || "No revenues found",
    toolbar: {
      new: t("table.new") || "New",
      search: t("table.searchPlaceholder") || "Search revenues...",
      filters: t("table.filters") || "Filters",
      filterColumns: t("table.filterColumns") || "Filter columns",
      reset: t("table.reset") || "Reset",
      print: t("table.print") || "Print",
      export: t("table.export") || "Export",
      excel: t("table.excel") || "Excel",
      csv: t("table.csv") || "CSV",
      pdf: t("table.pdf") || "PDF",
    },
    pagination: {
      rowsSelected: t("table.rowsSelected") || "row(s) selected",
      rowsPerPage: t("table.rowsPerPage") || "Rows per page",
      page: t("table.page") || "Page",
      of: t("table.of") || "of",
      firstPage: t("table.firstPage") || "First page",
      previousPage: t("table.previousPage") || "Previous page",
      nextPage: t("table.nextPage") || "Next page",
      lastPage: t("table.lastPage") || "Last page",
    },
    columns: {
      date: t("columns.date") || "Date",
      amount: t("columns.amount") || "Amount",
      description: t("columns.description") || "Description",
      category: t("columns.category") || "Category",
      actions: t("columns.actions") || "Actions",
      openMenu: t("columns.openMenu") || "Open menu",
      edit: t("columns.edit") || "Edit",
      delete: t("columns.delete") || "Delete",
    },
    deleteDialog: {
      title: t("deleteDialog.title") || "Delete Revenue",
      description: t("deleteDialog.description") || "Are you sure you want to delete this revenue? This action cannot be undone.",
      cancel: t("deleteDialog.cancel") || "Cancel",
      confirm: t("deleteDialog.confirm") || "Delete",
    },
  };

  return (
    <div className="container mx-auto">
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border flex w-full justify-between flex-row">
          <div>
            <div className="flex items-center gap-2 border-l-4 border-green-500 pl-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                {t("title") || "Revenue Management"}
              </CardTitle>
            </div>
            <CardDescription className="pt-1.5">
              {t("subtitle") || "Track and manage your revenue streams"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <RevenueModal
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("form.new") || "Add Revenue"}
                </Button>
              }
              onSuccess={handleRevenueCreated}
            />
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
            <RevenueTable
              revenues={revenues}
              onDelete={handleDeleteRevenue}
              translations={tableTranslations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenuePage;