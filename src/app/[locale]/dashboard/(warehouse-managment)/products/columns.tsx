"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { ProductViewDialog } from "../../../../../components/products/product-view-dialog";
import { ProductDeleteDialog } from "../../../../../components/products/product-delete-dialog";
import { Chip } from "@heroui/chip";
import { Product, Warehouse } from "@/types/products.type";
import { useRouter } from "next/navigation";

// Define column configuration with translation keys
export const createColumns = (
  t: any,
  onDeleteProduct?: (id: string) => Promise<void>
): ColumnDef<Product>[] => {
  const router = useRouter();
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
      accessorKey: "sku",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.sku") : "SKU"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Chip variant="faded" className="font-mono text-xs px-2 py-0 h-6">
          {row.getValue("sku")}
        </Chip>
      ),
    },
    {
      accessorKey: "barcode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.barcode") : "Barcode"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.getValue("barcode")}
        </span>
      ),
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
            {t ? t("columns.category") : "Category"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.getValue("category");
        return (
          <Chip variant="faded" className="font-mono text-xs px-2 py-0 h-6">
            {category ? category.name : t("table.undefined")}
          </Chip>
        );
      },
    },
    {
      accessorKey: "warehouse",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.warehouse") : "Warehouse"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const warehouse = row.getValue("warehouse") as Warehouse;

        return warehouse ? <span className="">{warehouse.name}</span> : t("table.undefined");
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.quantity") : "Quantity"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;

        let variant: "danger" | "warning" | "success";
        let label: string;

        if (quantity === 0) {
          variant = "danger";
          label = t("table.outOfStock");
        } else if (quantity > 0 && quantity <= 5) {
          variant = "warning";
          label = t("table.lowStock");
        } else {
          variant = "success";
          label = t("table.inStock");
        }

        return (
          <Chip
            variant="dot"
            color={variant}
            className="font-mono text-xs px-2 py-0 h-6"
          >
            {quantity} <span className="ml-1 hidden sm:inline">{label}</span>
          </Chip>
        );
      },
      filterFn: "includesString",
    },

    // {
    //   accessorKey: "description",
    //   header: () => (
    //     <div className="pl-1">
    //       {t ? t('columns.description') : 'Description'}
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <Tooltip>
    //       <TooltipTrigger asChild>
    //         <div className="max-w-[180px] truncate text-sm text-muted-foreground">
    //           {row.getValue("description")}
    //         </div>
    //       </TooltipTrigger>
    //       <TooltipContent className="max-w-sm">
    //         {row.getValue("description")}
    //       </TooltipContent>
    //     </Tooltip>
    //   ),
    // },
    {
      accessorKey: "purchasePrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.purchasePrice") : "Purchase Price"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("purchasePrice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-center font-medium">{formatted}</div>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "salePrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.salePrice") : "Sale Price"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("salePrice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return (
          <div className="text-center font-medium text-green-600">
            {formatted}
          </div>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "taxType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.tax") : "Tax"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const tax = row.getValue("taxType");
        return <div className="text-center font-medium">{tax}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <ProductViewDialog product={product} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => router.push(`/dashboard/products/edit-product?id=${product.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">
                    {t ? t("actions.edit") : "Edit"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  {t ? t("actions.edit") : "Edit product"}
                </p>
              </TooltipContent>
            </Tooltip>

            {onDeleteProduct && (
              <ProductDeleteDialog
                product={product}
                onDelete={onDeleteProduct}
              />
            )}
          </div>
        );
      },
    },
  ];
};
