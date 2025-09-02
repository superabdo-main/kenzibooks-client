"use client";

import React, { useState } from "react";
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
import { Loader2, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/shadcn-ui/tooltip";
import { TooltipTrigger } from "@/components/shadcn-ui/tooltip";
import { TooltipContent } from "@/components/shadcn-ui/tooltip";

interface TaxDeleteDialogProps {
  taxId: string;
  taxName: string;
  onConfirm: () => Promise<void>;
  children?: React.ReactNode;
}

export const TaxDeleteDialog: React.FC<TaxDeleteDialogProps> = ({
  taxId,
  taxName,
  onConfirm,
  children,
}) => {
  const t = useTranslations("SalesTax");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t ? t("actions.delete") : "Delete"}</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t ? t("deleteDialog.title") : "Delete Tax"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t
              ? t("deleteDialog.description", { name: taxName })
              : `Are you sure you want to delete the tax "${taxName}"? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t ? t("deleteDialog.cancel") : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t ? t("deleteDialog.deleting") : "Deleting..."}
              </>
            ) : t ? (
              t("deleteDialog.confirm")
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
