"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";
import { useTranslations } from "next-intl";
import { FixedAsset } from "@/types/fixed-assets.type";
import { format } from "date-fns";
import { Badge } from "@/components/shadcn-ui/badge";
import { X } from "lucide-react";

interface FixedAssetViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: FixedAsset | null;
}

export function FixedAssetViewDialog({
  isOpen,
  onClose,
  asset,
}: FixedAssetViewDialogProps) {
  const t = useTranslations("fixedAssets");
  
  if (!asset) return null;
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "disposed":
        return "outline";
      case "lost":
        return "destructive";
      case "sold":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>{asset.assetName}</span>
            <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            {t("viewAsset")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.assetCategory.label")}</p>
            <p className="font-medium capitalize">{asset.assetCategory}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.purchaseDate.label")}</p>
            <p className="font-medium">{format(new Date(asset.purchaseDate), "PPP")}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.purchaseCost.label")}</p>
            <p className="font-medium">{formatCurrency(asset.purchaseCost)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.currentValue.label")}</p>
            <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.depreciationMethod.label")}</p>
            <p className="font-medium capitalize">{asset.depreciationMethod.replace(/-/g, " ")}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.usefulLife.label")}</p>
            <p className="font-medium">{asset.usefulLife} years</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t("form.salvageValue.label")}</p>
            <p className="font-medium">{formatCurrency(asset.salvageValue)}</p>
          </div>
          
          {asset.location && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("form.location.label")}</p>
              <p className="font-medium">{asset.location}</p>
            </div>
          )}
        </div>
        
        {asset.description && (
          <div className="space-y-1 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">{t("form.description.label")}</p>
            <p className="text-sm">{asset.description}</p>
          </div>
        )}
        
        {asset.notes && (
          <div className="space-y-1 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">{t("form.notes.label")}</p>
            <p className="text-sm">{asset.notes}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              {t("form.buttons.close")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
} 