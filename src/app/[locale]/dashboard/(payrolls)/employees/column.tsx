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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { Employee as EmployeeType } from "@/types/employee.type";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<EmployeeType>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const employee = row.original as EmployeeType;
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
            {/* <DropdownMenuItem onClick={() => setShowPaymentDialog(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              {t("columns.addPayment")}
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/employees/edit-employee?id=${employee.id}`}
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
        {/* <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
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
        </Dialog> */}

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
                  await handleDelete(employee.id);
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
                        <span>{employee.details.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.email")}
                        </span>
                        <span>{employee.details.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.phone")}
                        </span>
                        <span>{employee.details.phone || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.employeeId")}
                        </span>
                        <span>{employee.details.employeeId || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.jobTitle")}
                        </span>
                        <span>{employee.details.jobTitle || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.workerCompClass")}
                        </span>
                        <span>{employee.details.workerCompClass || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.SSN")}
                        </span>
                        <span>{employee.details.SSN || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.jobTitle")}
                        </span>
                        <span>{employee.details.jobTitle || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.status")}
                        </span>
                        <span>{employee.details.status || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("infoDrawer.workLocation")}
                        </span>
                        <span>{employee.details.workLocation || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("infoDrawer.paymentInformation")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.payFrequency.label")}
                        </span>
                        <span>
                          {employee.paySchedule.payFrequency || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.nextPayDate.label")}
                        </span>
                        <span>
                          {employee.paySchedule.nextPayDate
                            ? new Date(
                                employee.paySchedule.nextPayDate
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.isDefault.label")}
                        </span>
                        <span>
                          {employee.paySchedule.isDefault
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.dayPerWeek.label")}
                        </span>
                        <span>{employee.payTypes.dayPerWeek || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.hourPerDay.label")}
                        </span>
                        <span>{employee.payTypes.hourPerDay || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.payType.label")}
                        </span>
                        <span>{employee.payTypes.payType || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.ratePerHour.label")}
                        </span>
                        <span>{employee.payTypes.ratePerHour || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.salary.label")}
                        </span>
                        <span>{employee.payTypes.salary || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("form.address.label")}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.address.label")}
                        </span>
                        <span>{employee.details.address || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.city.label")}
                        </span>
                        <span>{employee.details.city || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.state.label")}
                        </span>
                        <span>{employee.details.state || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.postCode.label")}
                        </span>
                        <span>{employee.details.postCode || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("form.country.label")}
                        </span>
                        <span>{employee.details.country || "-"}</span>
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
                    href={`/dashboard/payrolls/employees/edit-employee?id=${employee.id}`}
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
      accessorKey: "details.employeeId",
      cell: ({ row }) => row.original.details.employeeId || "-",
      header: t("columns.employeeId"),
    },
    {
      accessorKey: "name",
      cell: ({ row }) => row.original.details.name,
      header: t("columns.name"),
    },
    {
      accessorKey: "details.email",
      cell: ({ row }) => row.original.details.email,
      header: t("columns.email"),
    },
    {
      accessorKey: "details.phone",
      cell: ({ row }) => row.original.details.phone || "-",
      header: t("columns.phone"),
    },
    {
      accessorKey: "details.SSN",
      cell: ({ row }) => row.original.details.SSN || "-",
      header: t("columns.SSN"),
    },
    {
      accessorKey: "details.status",
      cell: ({ row }) => row.original.details.status || "-",
      header: t("columns.status"),
    },
    {
      accessorKey: "details.hireDate",
      cell: ({ row }) =>
        row.original.details.hireDate
          ? new Date(row.original.details.hireDate).toLocaleDateString()
          : "-",
      header: t("columns.hireDate"),
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-",
      header: t("columns.createdAt"),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
