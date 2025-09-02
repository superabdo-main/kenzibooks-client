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
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { useTranslations } from "next-intl";
import { PackageOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { ExpenseSubCategory } from "@/types/expenses.type";
import { ExpenseCategory } from "@/types/expenses.type";

interface SubCategoriesDialogProps {
  category: ExpenseCategory;
  subCategories: ExpenseSubCategory[];
}

export function SubCategoriesDialog({
  category,
  subCategories,
}: SubCategoriesDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Common");
  const tabel = useTranslations("ExpenseCategories");

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
            <p>
              {tabel
                ? tabel("actions.viewSubCategories")
                : "View SubCategories"}
            </p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{t("expenseSubCategories")}</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              {category.name}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {t
              .raw("subCategoriesCount")
              .replace("{count}", subCategories.length.toString() || "0")}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50">
              <TableRow>
                {/* <TableHead className="w-[80px]">{t("id")}</TableHead> */}
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("expenses")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories?.length! > 0 ? (
                subCategories?.map((subCategory: ExpenseSubCategory) => (
                  <TableRow key={subCategory.id} className="hover:bg-muted/50">
                    <TableCell>{subCategory.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {subCategory._count.expenses || 0}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("noSubCategoriesFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
