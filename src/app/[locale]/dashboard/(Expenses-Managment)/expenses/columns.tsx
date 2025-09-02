import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { MoreHorizontal, Info, Trash2 } from "lucide-react";
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
import { ExpenseInstance } from "@/types/expenses.type";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<ExpenseInstance>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const expenseInstance = row.original as ExpenseInstance;
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showInfoDrawer, setShowInfoDrawer] = React.useState(false);

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
            <DropdownMenuItem onClick={() => setShowInfoDrawer(true)}>
              <Info className="mr-2 h-4 w-4" />
              {t("columns.info")}
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
                  await handleDelete(expenseInstance.id);
                  setShowDeleteDialog(false);
                }}
              >
                {t("deleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Info Drawer */}
        <Drawer open={showInfoDrawer} onOpenChange={setShowInfoDrawer}>
          <DrawerContent>
            <div className="mx-auto w-full max-w-4xl">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-semibold">
                  {t("infoDrawer.title")}
                </DrawerTitle>
                <DrawerDescription>
                  {t("infoDrawer.description")}
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-[65vh] px-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.basicInfo")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.reference")}
                        </span>
                        <span>{expenseInstance.expense.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.category")}
                        </span>
                        <span>
                          {expenseInstance.expense.category.name} {"->"}{" "}
                          {expenseInstance.expense.category.category.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.type")}
                        </span>
                        <span>{expenseInstance.expense.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.expenseFor")}
                        </span>
                        <span>{expenseInstance.expense.expenseFor}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Tax Information */}
                  <div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.amount")}
                        </span>
                        <span>{expenseInstance.expense.amount || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.repeatEvery")}
                        </span>
                        <span>
                          {expenseInstance.expense.repeatEvery || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.startDate")}
                        </span>
                        <span>
                          {expenseInstance.expense.startDate
                            ? new Date(
                                expenseInstance.expense.startDate
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.lastGenerated")}
                        </span>
                        <span>
                          {expenseInstance.expense.lastGenerated
                            ? new Date(
                                expenseInstance.expense.lastGenerated
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              </ScrollArea>
              <DrawerFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInfoDrawer(false)}
                >
                  {t("infoDrawer.close")}
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  };

  return [
    {
      accessorKey: "category",
      header: t("columns.category"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.expense.category.name} {"->"}{" "}
          {row.original.expense.category.category.name}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
      cell: ({ row }) => (
        <div>{formatCurrency(row.original.expense.amount)}</div>
      ),
    },
    {
      accessorKey: "reference",
      header: t("columns.reference"),
      cell: ({ row }) => <div>{row.original.expense.reference}</div>,
    },
    {
      accessorKey: "expenseFor",
      header: t("columns.expenseFor"),
      cell: ({ row }) => <div>{row.original.expense.expenseFor}</div>,
    },
    {
      accessorKey: "date",
      header: t("columns.date"),
      cell: ({ row }) => (
        <div>
          {row.original.date
            ? new Date(row.original.date).toLocaleDateString()
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
