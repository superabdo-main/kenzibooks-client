"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import { Button } from "@/components/shadcn-ui/button";
import { useTranslations } from "next-intl";
import { PackageOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { ExpenseType } from "@/types/expenses.type";

interface ExpensesDialogProps {
  expenses: ExpenseType[];
}

export function ExpenseListViewDialog({ expenses }: ExpensesDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("ExpenseSubCategories");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(true)}
            >
              <PackageOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("actions.viewExpenses")}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{t("ExpenseView.expenses")}</span>
          </DialogTitle>
          <DialogDescription>
            {t.raw("expensesCount").replace(
              "{count}",
              expenses.length.toString() || "0"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50">
              <TableRow>
                <TableHead>{t("ExpenseView.amount")}</TableHead>
                <TableHead>{t("ExpenseView.reference")}</TableHead>
                <TableHead>{t("ExpenseView.startDate")}</TableHead>
                <TableHead>{t("ExpenseView.expenseFor")}</TableHead>
                <TableHead>{t("ExpenseView.repeatEvery")}</TableHead>
                <TableHead>{t("ExpenseView.type")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses?.length! > 0 ? (
                expenses?.map((expense: ExpenseType) => (
                  <TableRow key={expense.id} className="hover:bg-muted/50">
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>{expense.reference}</TableCell>
                    <TableCell>{expense.startDate ? new Date(expense.startDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{expense.expenseFor}</TableCell>
                    <TableCell>{expense.repeatEvery}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("noExpensesFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("ExpenseView.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
