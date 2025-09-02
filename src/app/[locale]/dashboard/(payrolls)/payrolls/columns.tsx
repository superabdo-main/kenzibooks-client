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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeePaySchedule } from "@/types/employee.type";
import { usePayrolls } from "@/features/payrolls/hooks/usePayrolls";
import { useEmployeesStore } from "@/stores/employees.store";
import EditPayrollScheduleForm from "@/features/payrolls/forms/edit-form";
import Link from "next/link";

export const createColumns = (
  t: any,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<EmployeePaySchedule>[] => {
  // Use hook pattern in a component inside the cell render function
  // since hooks can't be used directly in column definitions
  const ActionsCell = ({ row }: { row: any }) => {
    const PaySchedule = row.original as EmployeePaySchedule;
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const { updatePayroll } = useEmployeesStore();
    const [showRunDialog, setShowRunDialog] = React.useState(false);
    const { mutate } = usePayrolls();
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
          <DropdownMenuContent align="end" >
            <DropdownMenuItem className="">
              <Link
                href={`/dashboard/payrolls/pay?id=${PaySchedule.id}`}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                {t("columns.run")}
              </Link>
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
                {t("payroll.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("payroll.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <EditPayrollScheduleForm
                payrollSchedule={PaySchedule}
                onCancel={() => setShowEditDialog(false)}
                onSubmit={(data) =>
                  updatePayroll({
                    id: PaySchedule.id!,
                    payrollSchedule: data,
                    accessToken: session?.accessToken!,
                  }).then((res) => {
                    if (res.isOk) {
                      mutate();
                      setShowEditDialog(false);
                    }
                  })
                }
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
                  await handleDelete(PaySchedule.id!);
                  setShowDeleteDialog(false);
                }}
              >
                {t("deleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* <AlertDialog open={showRunDialog} onOpenChange={setShowRunDialog}>
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
        </AlertDialog> */}
      </>
    );
  };

  return [
    {
      accessorKey: "payFrequency",
      header: t("form.payFrequency.label"),
      cell: ({ row }) => <div>{row.original.payFrequency}</div>,
    },
    {
      accessorKey: "nextPayDate",
      header: t("form.nextPayDate.label"),
      cell: ({ row }) => (
        <div>
          {row.original.nextPayDate
            ? new Date(row.original.nextPayDate).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: t("form.isDefault.label"),
      cell: ({ row }) => <div>{row.original.isDefault ? "Yes" : "No"}</div>,
    },
    {
      accessorKey: "total",
      header: t("columns.total"),
      cell: ({ row }) => <div>{row.original._count?.employee}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
