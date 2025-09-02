"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn-ui/alert-dialog";
import { Button } from "@/components/shadcn-ui/button";
import { useTranslations } from "next-intl";
import { Category } from "@/stores/categories.store";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { Trash2 } from "lucide-react";

interface CategoryDeleteDialogProps {
  category: Category;
  onConfirm: () => Promise<void>;
  children?: React.ReactNode; // Optional children for custom trigger
}

export function CategoryDeleteDialog({
  category,
  onConfirm,
  children,
}: CategoryDeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const t = useTranslations("Categories");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">
                {t ? t("actions.delete") : "Delete"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t ? t("actions.delete") : "Delete"}</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            {t("deleteDialog.confirmText")}
            <span className="font-medium text-foreground ml-1">
              {category.name}
            </span>
          </p>
          {category.numberOfProducts > 0 && (
            <p className="mt-2 text-destructive">
              {t("deleteDialog.warning")} {category.numberOfProducts}{" "}
              {category.numberOfProducts === 1
                ? t("deleteDialog.product")
                : t("deleteDialog.products")}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting
              ? t("deleteDialog.deleting")
              : t("deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
