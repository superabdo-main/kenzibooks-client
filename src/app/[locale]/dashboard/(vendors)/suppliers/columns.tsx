import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SupplierType } from "@/types/suppliers.type";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcn-ui/dialog";
import SupplierPaymentForm from "@/components/suppliers/supplier-peyment-form";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<SupplierType>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const supplier = row.original as SupplierType;
    const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);
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
              {t("columns.addPayment")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/suppliers/edit-supplier?id=${supplier.id}`}>
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
                {t("paymentForm.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("paymentForm.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <SupplierPaymentForm 
                onCancel={() => setShowPaymentDialog(false)}
              />
            </div>
          </DialogContent>
        </Dialog>


        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("deleteDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("deleteDialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 focus:ring-red-600"
                onClick={async () => {
                  await handleDelete(supplier.id);
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
                        <span>{supplier.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.contact")}
                        </span>
                        <span>{supplier.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.email")}
                        </span>
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.openingBalance")}
                        </span>
                        <span>{formatCurrency(supplier.openingBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.outstandingBalance")}
                        </span>
                        <span>{formatCurrency(supplier.outStandingBalance)}</span>
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
                          {t("infoDrawer.gstNumber")}
                        </span>
                        <span>{supplier.GSTNumber || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.taxNumber")}
                        </span>
                        <span>{supplier.taxNumber || "-"}</span>
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
                        <span>{supplier.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.city")}
                        </span>
                        <span>{supplier.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.state")}
                        </span>
                        <span>{supplier.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.postCode")}
                        </span>
                        <span>{supplier.postCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.country")}
                        </span>
                        <span>{supplier.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter>
                <Button variant="outline" onClick={() => setShowInfoDrawer(false)}>
                  {t("infoDrawer.close")}
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/suppliers/edit-supplier?id=${supplier.id}`}>
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
      accessorKey: "contact",
      header: t("columns.contact"),
    },
    {
      accessorKey: "country",
      header: t("columns.country"),
    },
    {
      accessorKey: "outStandingBalance",
      header: t("columns.outstandingBalance"),
      cell: ({ row }) => formatCurrency(row.original.outStandingBalance),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
}; 