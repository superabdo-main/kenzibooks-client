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
import { useProductsStore } from "@/stores/products.store";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { PackageOpen } from "lucide-react";
import { Product } from "@/types/products.type";
import { WarehouseType } from "@/types/warehouses.type";
import { useWarehouseProducts } from "@/features/warehouses/hooks/useWarehousesProducts";

interface WarehouseProductsDialogProps {
  warehouse: WarehouseType;
}

export function WarehouseProductsDialog({
  warehouse,
}: WarehouseProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const { products, isLoading } = useWarehouseProducts({
    warehouseId: warehouse.id,
  });
  const t = useTranslations("Warehouses");
  const tCommon = useTranslations("Common");

  // Fetch products when dialog opens
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <span className="sr-only">{t("actions.viewProducts")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("actions.viewProducts")}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t("viewProducts.title")} - {warehouse.name}
          </DialogTitle>
          <DialogDescription>{t("viewProducts.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center py-4">
          <Badge variant="outline" className="text-xs py-1">
            {warehouse.productCount}{" "}
            {warehouse.productCount === 1
              ? t("viewProducts.product")
              : t("viewProducts.products")}
          </Badge>
        </div>

        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{tCommon("sku")}</TableHead>
                  <TableHead className="text-right">
                    {tCommon("price")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length! === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t("viewProducts.noProducts")}
                    </TableCell>
                  </TableRow>
                ) : (
                  products?.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.salePrice)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
