import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Copy, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { Badge } from "@/components/shadcn-ui/badge";
import { FixedAsset } from "@/types/fixed-assets.type";

export const createColumns = (
  t: any,
  onDelete?: (asset: FixedAsset) => void,
  onView?: (asset: FixedAsset) => void,
): ColumnDef<FixedAsset>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "assetName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.assetName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("assetName")}</div>
      ),
    },
    {
      accessorKey: "assetCategory",
      header: t("table.assetCategory"),
      cell: ({ row }) => {
        const category = row.getValue("assetCategory") as string;
        return <div className="capitalize">{category}</div>;
      },
    },
    {
      accessorKey: "purchaseDate",
      header: t("table.purchaseDate"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("purchaseDate"));
        return <div>{format(date, "MMM d, yyyy")}</div>;
      },
    },
    {
      accessorKey: "purchaseCost",
      header: () => <div className="text-right">{t("table.purchaseCost")}</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("purchaseCost"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "currentValue",
      header: () => <div className="text-right">{t("table.currentValue")}</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("currentValue") || "0");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "active" ? "default" : "secondary";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const asset = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("table.actions")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(asset.id)}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{t("table.copyId")}</span>
                  </DropdownMenuItem>
                  {onView && (
                    <DropdownMenuItem 
                      onClick={() => onView(asset)}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>{t("table.view")}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>{t("table.edit")}</span>
                  </DropdownMenuItem>
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(asset)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("table.delete")}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
