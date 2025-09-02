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
import { FolderIcon, PlusIcon } from "lucide-react";
import { useCategoriesStore } from "@/stores/categories.store";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";
import { withPermission } from "@/components/auth/WithPermission";
import { useUserAccess } from "@/hooks/useUserAccess";
import { PermissionAction } from "@/components/auth/WithPermission";

const CategoriesPage = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const t = useTranslations("Categories");
  const { categories, isLoading, mutate } = useCategories();
  const { toast } = useToast();
  const { canCreate, canDelete } = useUserAccess();

  const { deleteCategory } = useCategoriesStore();

  const handleDeleteCategory = async (id: string) => {
    // Check if user has delete permission
    if (!canDelete('categories')) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to delete categories",
      });
      return;
    }
    
    if (!session?.accessToken || !organizationId) return;
    const response = await deleteCategory({
      id,
      accessToken: session?.accessToken,
      organizationId: organizationId,
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
      description: "Category deleted successfully",
    });
    return Promise.resolve();
  };

  // Create columns with translations and permissions
  const columns = createColumns(t, canDelete('categories') ? handleDeleteCategory : undefined);

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
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <FolderIcon className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                {t("title")}
              </CardTitle>
            </div>
            <CardDescription className="pt-1.5">
              {t("subtitle")}
            </CardDescription>
          </div>
          <div>
            <PermissionAction feature="categories" action="create">
              <Button
                variant="outline"
                size="sm"
                className="h-10 bg-background border-border hover:bg-muted/50"
                asChild
              >
                <Link href={"/dashboard/categories/new-category"}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  {t("table.new")}
                </Link>
              </Button>
            </PermissionAction>
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
              data={categories || []}
              searchColumn="name"
              translations={tableTranslations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Wrap the component with permission check
export default withPermission(CategoriesPage, {
  feature: 'categories',
  action: 'view'
});
