import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { MoreHorizontal, Info, Pencil, Trash2, CreditCard } from "lucide-react";
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
import { CustomerType, DepositType } from "@/types/customers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import DepositForm from "@/features/customers/forms/deposit-form";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<CustomerType>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const customer = row.original as CustomerType;
    const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);
    const [showDepositHistoryDialog, setShowDepositHistoryDialog] =
      React.useState(false);
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
            <DropdownMenuItem onClick={() => setShowPaymentDialog(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              {t("columns.deposit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDepositHistoryDialog(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              {t("columns.depositHistory")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/customers/edit-customer?id=${customer.id}`}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t("columns.edit")}
              </Link>
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

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold">
                {t("depositForm.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("depositForm.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <DepositForm
                customerId={customer.id}
                onCancel={() => setShowPaymentDialog(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Deposit History Dialog */}
        <Dialog
          open={showDepositHistoryDialog}
          onOpenChange={setShowDepositHistoryDialog}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold">
                {t("depositHistoryForm.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("depositHistoryForm.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div>
                <div className="mt-2">
                  <div className="rounded-md border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                          >
                            {t("depositForm.paymentDate.label")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                          >
                            {t("depositForm.paidBy.label")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                          >
                            {t("depositForm.amount.label")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                          >
                            {t("depositForm.note.label")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {customer.depositHistory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(item.paymentDate).toLocaleDateString() || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {item.paidBy || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatCurrency(item.amount) || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {item.note || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
                  await handleDelete(customer.id);
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
                          {t("infoDrawer.name")}
                        </span>
                        <span>{customer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.phone")}
                        </span>
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.email")}
                        </span>
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Tax Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.taxInfo")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.exemptionNumber")}
                        </span>
                        <span>{customer.exemptionNumber || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.antityCode")}
                        </span>
                        <span>{customer.antityCode || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.taxNumber")}
                        </span>
                        <span>{customer.taxNumber || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.addressInfo")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.address")}
                        </span>
                        <span>{customer.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.city")}
                        </span>
                        <span>{customer.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.state")}
                        </span>
                        <span>{customer.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.postCode")}
                        </span>
                        <span>{customer.postCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.country")}
                        </span>
                        <span>{customer.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInfoDrawer(false)}
                >
                  {t("infoDrawer.close")}
                </Button>
                <Button asChild>
                  <Link
                    href={`/dashboard/customers/edit-customer?id=${customer.id}`}
                  >
                    {t("infoDrawer.edit")}
                  </Link>
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
      accessorKey: "name",
      header: t("columns.name"),
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
    },
    {
      accessorKey: "phone",
      header: t("columns.phone"),
    },
    {
      accessorKey: "country",
      header: t("columns.country"),
    },
    {
      accessorKey: "currency",
      header: t("columns.currency"),
    },
    {
      accessorKey: "taxNumber",
      header: t("columns.taxNumber"),
    },
    {
      accessorKey: "depositHistory",
      header: t("columns.depositHistory"),
      cell: ({ row }) => (
        <div>
          {row.original.depositHistory
            .reduce(
              (total: number, deposit: DepositType) => total + deposit.amount,
              0
            )
            .toFixed(2)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
