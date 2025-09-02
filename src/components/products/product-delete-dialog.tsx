"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Product } from "@/types/products.type"; 
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";

interface ProductDeleteDialogProps {
  product: Product;
  onDelete: (id: string) => Promise<void>;
  children?: React.ReactNode; // Optional children for custom trigger
}

export function ProductDeleteDialog({
  product,
  onDelete,
  children,
}: ProductDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("Products");
  const locale = useLocale()

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(product.id);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
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
              className="h-8 w-8 text-destructive hover:text-destructive/80"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">
                {t ? t("actions.delete") : "Delete"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">
              {t ? t("actions.delete") : "Delete product"}
            </p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t("dialogs.delete.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className={`font-medium`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {t
                .raw("dialogs.delete.description")
                .replace("productName", product.name)}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-2 rounded-md bg-muted/50 p-3">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {product.name} ({product.sku})
              </p>
              <p className={`text-xs text-muted-foreground`}>
                {t("dialogs.delete.permanentAction")}
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("dialogs.delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("dialogs.delete.deleting")}
              </>
            ) : (
              t("dialogs.delete.confirm")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
