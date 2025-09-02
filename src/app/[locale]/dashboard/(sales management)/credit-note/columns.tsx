import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SaleType, TermsType } from "@/types/sales.type";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { MoreHorizontal, Info, Pencil, Trash2, CreditCard } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
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
import { Badge } from "@/components/shadcn-ui/badge";
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
import { usePathname, useRouter } from "next/navigation";

// Translate terms to display values
const getTermsLabel = (terms: TermsType) => {
  switch (terms) {
    case "DUE_ON_RECEIPT":
      return "Due on Receipt";
    case "NET_15":
      return "Net 15";
    case "NET_30":
      return "Net 30";
    case "NET_60":
      return "Net 60";
    default:
      return terms;
  }
};

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "UNPAID":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "PAID":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "PARTIALLY_PAID":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<SaleType>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const sale = row.original as SaleType;
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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/credit-note/process-payment?id=${sale.id}`}>
                <CreditCard className="mr-2 h-4 w-4" />
                {t("columns.processPayment")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/credit-note/edit-credit-note?id=${sale.id}`}>
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
                  await handleDelete(sale.id);
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
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.customerInfo")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.customerEmail")}
                        </span>
                        <span>{sale.customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.terms")}
                        </span>
                        <span>{getTermsLabel(sale.paymentTerm)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Dates */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.dates")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.saleDate")}
                        </span>
                        <span>{formatDate(sale.saleDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.expectedDeliveryDate")}
                        </span>
                        <span>
                          {formatDate(sale.expectedShipmentDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Addresses */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.addresses")}
                    </h3>
                    <div className="mt-2 space-y-4">
                      <div>
                        <h4 className="font-medium">
                          {t("infoDrawer.billingAddress")}
                        </h4>
                        <p>
                          {sale.address.billingStreet}
                          <br />
                          {sale.address.billingCity},{" "}
                          {sale.address.billingState}{" "}
                          {sale.address.billingZipPostalCode}
                          <br />
                          {sale.address.billingCountry}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("infoDrawer.shippingAddress")}
                        </h4>
                        <p>
                          {sale.address.shippingStreet}
                          <br />
                          {sale.address.shippingCity},{" "}
                          {sale.address.shippingState}{" "}
                          {sale.address.shippingZipPostalCode}
                          <br />
                          {sale.address.shippingCountry}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Sale Items */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.items")}
                    </h3>
                    <div className="mt-2">
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("infoDrawer.productName")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("infoDrawer.quantity")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("infoDrawer.unitPrice")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("infoDrawer.total")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sale.items?.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(item.unitPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(item.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Sale Summary */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.summary")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.subtotal")}
                        </span>
                        <span>{formatCurrency(sale.subTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.salesTax")}
                        </span>
                        <span>{formatCurrency(sale.salesTaxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.discount")}
                        </span>
                        <span>{formatCurrency(sale.discount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>{t("infoDrawer.grandTotal")}</span>
                        <span>{formatCurrency(sale.grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {sale.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium">
                          {t("infoDrawer.notes")}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {sale.notes}
                        </p>
                      </div>
                    </>
                  )}
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
      accessorKey: "customerEmail",
      header: t("columns.customer"),
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.original.customer.email}
          </div>
        );
      },
    },
    {
      accessorKey: "saleDate",
      header: t("columns.saleDate"),
      cell: ({ row }) => {
        return <div>{formatDate(row.original.saleDate)}</div>;
      },
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: t("columns.expectedDeliveryDate"),
      cell: ({ row }) => {
        return <div>{formatDate(row.original.expectedShipmentDate)}</div>;
      },
    },
    {
      accessorKey: "grandTotal",
      header: t("columns.grandTotal"),
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {formatCurrency(row.original.grandTotal)}
          </div>
        );
      },
    },
    {
      accessorKey: "terms",
      header: t("columns.terms"),
      cell: ({ row }) => {
        return <div>{getTermsLabel(row.original.paymentTerm)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={`${getStatusColor(status)} capitalize`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
}; 