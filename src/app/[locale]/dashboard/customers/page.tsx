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
import { Building2, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";
import { useCustomersStore } from "@/stores/customers.store";

const CustomersPage = () => {
  const t = useTranslations("Customers");
  const { customers, isLoading, mutate } = useCustomers();
  const { deleteCustomer } = useCustomersStore();
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const {toast} = useToast()

  const handleDeleteCustomer = async (id: string) => {
    if (!session?.accessToken || !organizationId) return;
    const customer = await deleteCustomer({
      id,
      accessToken: session?.accessToken!,
    });
    if (customer.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: customer.error,
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Customer deleted successfully",
      });
      mutate();
    }
  };

  // Create columns with translations
  const columns = createColumns(t, handleDeleteCustomer);

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
            <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
              <Building2 className="h-5 w-5 text-blue-500" />
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
              <Link href={`/dashboard/customers/new-customer`}>
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
              data={customers || []}
              searchColumn="name"
              translations={tableTranslations}
              // onExportPDF={() => exportCustomersToPDF(customers || [], t)}
              // onExportExcel={() => exportCustomersToExcel(customers || [], t)}
              // onExportCSV={() => exportSuppliersToCSV(suppliers || [], t)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
