"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Eye } from "lucide-react";
import { Separator } from "@/components/shadcn-ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { Product } from "@/types/products.type";

interface ProductViewDialogProps {
  product: Product;
  children?: React.ReactNode; // Optional children for custom trigger
}

export function ProductViewDialog({
  product,
  children,
}: ProductViewDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Products");

  // Format currency for prices
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(true)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t ? t("actions.view") : "View"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t ? t("actions.view") : "View product"}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {product.name}
            <Badge variant="outline" className="ml-2">
              {product.sku}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("dialogs.view.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Product details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">{t("columns.uuid")}</p>
              <p className="font-medium font-mono text-xs">{product.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">{t("columns.barcode")}</p>
              <p className="font-medium font-mono">{product.barcode}</p>
            </div>
          </div>

          <Separator />

          {/* Price information */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t("sections.pricing")}</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {t("columns.purchasePrice")}
                </p>
                <p className="font-medium">
                  {formatCurrency(product.purchasePrice)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {t("columns.salePrice")}
                </p>
                <p className="font-medium text-emerald-600">
                  {formatCurrency(product.salePrice)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t("sections.margin")}</p>
                <p className="font-medium">
                  {Math.round(
                    ((product.salePrice - product.purchasePrice) /
                      product.purchasePrice) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t("columns.tax")}</p>
                <p className="font-medium">{product.taxType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t("columns.taxCode")}</p>
                <p className="font-medium">{product.taxCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">{t("columns.description")}</h3>
            <p className="text-sm whitespace-pre-wrap">
              {product.description || t("sections.noDescription")}
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("dialogs.view.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
