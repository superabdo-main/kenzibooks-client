"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { Badge } from "@/components/shadcn-ui/badge";
import { CategoryDeleteDialog } from "@/components/categories/category-delete-dialog";
import { ExpenseSubCategory } from "@/types/expenses.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { useState } from "react";
import { ExpenseListViewDialog } from "@/features/expenses/forms/subcategories/expensesListView";
import { ExpenseSubCategoryEditForm } from "@/features/expenses/forms/subcategories/edit-form";

// Define column configuration with translation keys
export const createColumns = (
  t: any,
  onDeleteCategory?: (id: string) => Promise<void>
): ColumnDef<ExpenseSubCategory>[] => {
  const [editingCategory, setEditingCategory] =
    useState<ExpenseSubCategory | null>(null);
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.parentCategory") : "Parent Category"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.category.name}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.name") : "Name"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "expenses",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.total") : "Number of Products"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs px-2 py-0 h-6">
          {row.original._count.expenses}
        </Badge>
      ),
      filterFn: "includesString",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Dialog
              open={!!editingCategory}
              onOpenChange={(open) => !open && setEditingCategory(null)}
            >
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
                  {editingCategory && (
                    <ExpenseSubCategoryEditForm
                      key={editingCategory.id}
                      subCategoryData={editingCategory}
                      onCancel={() => setEditingCategory(null)}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <ExpenseListViewDialog expenses={category.expenses} />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingCategory(category)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t ? t("actions.edit") : "Edit"}</p>
              </TooltipContent>
            </Tooltip>

            <CategoryDeleteDialog
              category={category}
              onConfirm={async () => {
                if (onDeleteCategory) {
                  await onDeleteCategory(category.id);
                }
              }}
            />
          </div>
        );
      },
    },
  ];
};
