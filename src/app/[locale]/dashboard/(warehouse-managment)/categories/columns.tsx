"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Trash2, PackageOpen } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { Badge } from "@/components/shadcn-ui/badge";
import Link from "next/link";
import { CategoryDeleteDialog } from "@/components/categories/category-delete-dialog";
import { CategoryProductsDialog } from "@/components/categories/category-products-dialog";
import { Category } from "@/types/category";
import { PermissionControl } from "@/components/auth/PermissionGuard";

// Define column configuration with translation keys
export const createColumns = (
  t: any,
  onDeleteCategory?: (id: string) => Promise<void>
): ColumnDef<Category>[] => {
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
      accessorKey: "uuid",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.id") : "ID"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-xs text-muted-foreground">
          {row.getValue("uuid")}
        </div>
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "productCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.numberOfProducts") : "Number of Products"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs px-2 py-0 h-6">
          {row.getValue("productCount")}
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
            <CategoryProductsDialog category={category} />

            <PermissionControl feature="categories" action="edit">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/dashboard/categories/edit-category?id=${category.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t ? t("actions.edit") : "Edit"}</p>
                </TooltipContent>
              </Tooltip>
            </PermissionControl>

            {onDeleteCategory && (
              <PermissionControl feature="categories" action="delete">
                <CategoryDeleteDialog
                  category={category}
                  onConfirm={async () => {
                    if (onDeleteCategory) {
                      await onDeleteCategory(category.id);
                    }
                  }}
                />
              </PermissionControl>
            )}
          </div>
        );
      },
    },
  ];
};
