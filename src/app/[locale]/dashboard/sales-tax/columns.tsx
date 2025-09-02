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
import { Tax } from "@/types/tax";
import { TaxDeleteDialog } from "@/features/taxes/components/tax-delete-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { TaxEditForm } from "@/features/taxes/forms/edit-form";

// Define column configuration with translation keys
export const createColumns = (
  t: any,
  onDeleteTax?: (id: string) => Promise<void>
): ColumnDef<Tax>[] => {
  const [editingTax, setEditingTax] = useState<Tax | null>(null);

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
            {t ? t("columns.name") : "Tax Name"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "rate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.rate") : "Tax Rate"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("rate"));
        return <div className="font-medium">{rate}%</div>;
      },
    },
    {
      accessorKey: "applyOn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.applyOn") : "Apply On"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const applyOn = row.getValue("applyOn") as string;
        return (
          <div className="font-medium">
            {applyOn === "ALL_PRODUCTS" ? "All Products" : "Specific Products"}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-1 hover:bg-transparent"
          >
            {t ? t("columns.description") : "Description"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="font-medium text-muted-foreground">
            {description || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tax = row.original;

        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTax(tax)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t ? t("actions.edit") : "Edit"}</p>
              </TooltipContent>
            </Tooltip>

            {onDeleteTax && (
              <TaxDeleteDialog
                taxId={tax.id}
                taxName={tax.name}
                onConfirm={() => onDeleteTax(tax.id)}
                
              />
            )}

            {/* Edit Dialog */}
            <Dialog
              open={!!editingTax && editingTax.id === tax.id}
              onOpenChange={(open) => {
                if (!open) setEditingTax(null);
              }}
            >
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {t ? t("editForm.title") : "Edit Tax"}
                  </DialogTitle>
                  <DialogDescription>
                    {t ? t("editForm.subtitle") : "Update tax information"}
                  </DialogDescription>
                </DialogHeader>
                {editingTax && (
                  <TaxEditForm
                    tax={editingTax}
                    onCancel={() => setEditingTax(null)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];
};
