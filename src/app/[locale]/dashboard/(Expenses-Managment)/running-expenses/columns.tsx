import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  MoreHorizontal,
  Info,
  Pencil,
  Trash2,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/shadcn-ui/drawer";
import { Separator } from "@/components/shadcn-ui/separator";
import { ScrollArea } from "@/components/shadcn-ui/scroll-area";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { ExpenseType } from "@/types/expenses.type";
import ExpenseEditForm from "@/features/expenses/forms/edit-form";
import { useExpenseStore } from "@/stores/expenses.store";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<ExpenseType>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const expense = row.original as ExpenseType;
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showRunDialog, setShowRunDialog] = React.useState(false);
    const { runExpense, isLoading } = useExpenseStore();
    const { mutate } = useExpenses();
    const { session } = useAuth();

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <span className="sr-only">{t("columns.openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className=""
              onClick={() => setShowRunDialog(true)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              {t("columns.run")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className=""
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t("columns.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("columns.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
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
              <ExpenseEditForm
                expenseData={expense}
                onCancel={() => setShowEditDialog(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 focus:ring-red-600"
                onClick={async () => {
                  await handleDelete(expense.id);
                  setShowDeleteDialog(false);
                }}
              >
                {t("deleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showRunDialog} onOpenChange={setShowRunDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("runDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("runDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("runDialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                className="bg-green-600 focus:ring-green-600"
                onClick={async () => {
                  await runExpense({
                    id: expense.id,
                    accessToken: session?.accessToken!,
                  }).then((res) => {
                    if (res.isOk) {
                      mutate();
                      setShowDeleteDialog(false);
                    }
                  });
                }}
              >
                {t("runDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return [
    {
      accessorKey: "category",
      header: t("columns.category"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.category.name} {"->"}{" "}
          {row.original.category.category.name}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
    },
    {
      accessorKey: "reference",
      header: t("columns.reference"),
    },
    {
      accessorKey: "expenseFor",
      header: t("columns.expenseFor"),
    },
    {
      accessorKey: "type",
      header: t("columns.type"),
    },
    {
      accessorKey: "startDate",
      header: t("columns.startDate"),
      cell: ({ row }) => (
        <div>
          {row.original.startDate
            ? new Date(row.original.startDate).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "repeatEvery",
      header: t("columns.repeatEvery"),
      cell: ({ row }) => <h1>{row.original.repeatEvery} (days)</h1>,
    },
    {
      accessorKey: "lastGenerated",
      header: t("columns.lastGenerated"),
      cell: ({ row }) => (
        <div>
          {row.original.lastGenerated
            ? new Date(row.original.lastGenerated).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "instances",
      header: t("columns.instances"),
      cell: ({ row }) => <div>{row.original._count.instances}</div>,
    },
    {
      accessorKey: "createdAt",
      header: t("columns.createdAt"),
      cell: ({ row }) => (
        <div>
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
