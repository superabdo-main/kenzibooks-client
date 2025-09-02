import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn-ui/alert-dialog";
import { Revenue } from "@/stores/revenue.store";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<Revenue>[] => {
  // Actions cell component with hooks
  const ActionsCell = ({ row }: { row: any }) => {
    const revenue = row.original as Revenue;
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <span className="sr-only">{t.columns.openMenu}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t.columns.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.deleteDialog.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.deleteDialog.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.deleteDialog.cancel}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 focus:ring-red-600"
                onClick={async () => {
                  await handleDelete(revenue.id);
                  setShowDeleteDialog(false);
                }}
              >
                {t.deleteDialog.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return [
    {
      accessorKey: "date",
      header: t.columns.date,
      cell: ({ row }) => (
        <div>
          {row.original.date
            ? new Date(row.original.date).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: t.columns.amount,
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t.columns.description,
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.description || "-"}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: t.columns.category,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.category
            ? `${row.original.category.name} -> ${row.original.category.category?.name || ""}`
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: t.columns.actions,
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};