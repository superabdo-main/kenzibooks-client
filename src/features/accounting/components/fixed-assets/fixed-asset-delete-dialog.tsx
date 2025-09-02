"use client";

import { useState } from "react";
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
import { useTranslations } from "next-intl";
import { useFixedAssetsStore } from "@/stores/fixed-assets.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FixedAssetDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
  assetName: string;
  onSuccess: () => void;
}

export function FixedAssetDeleteDialog({
  isOpen,
  onClose,
  assetId,
  assetName,
  onSuccess,
}: FixedAssetDeleteDialogProps) {
  const t = useTranslations("fixedAssets");
  const { session } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAsset } = useFixedAssetsStore();

  const handleDelete = async () => {
    if (!session?.accessToken) {
      toast({
        title: t("error.deleteError"),
        description: "Authentication missing",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteAsset({
        id: assetId,
        accessToken: session.accessToken,
      });

      if (response.isOk) {
        toast({
          title: t("success.deleted"),
          description: t("success.deleted"),
        });
        onSuccess();
      } else {
        throw new Error(response.error || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: t("error.deleteError"),
        description: error instanceof Error ? error.message : t("error.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteAsset")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("confirmDelete")}
            <div className="mt-2 font-medium">
              {assetName}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("form.buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? t("form.buttons.deleting") : t("form.buttons.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 