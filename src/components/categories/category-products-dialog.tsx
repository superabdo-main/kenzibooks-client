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
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { PackageOpen } from "lucide-react";
import { Product } from "@/types/products.type";
import { useCategoryProducts } from "@/features/categories/hooks/useCategoryProducts";
import { Category } from "@/types/category";

interface CategoryProductsDialogProps {
  category: Category;
}

export function CategoryProductsDialog({
  category,
}: CategoryProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const { products, isLoading } = useCategoryProducts({ categoryId: category.id });
  const t = useTranslations("Common");
  const tabel = useTranslations("Categories");


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
            <p>{tabel ? tabel("actions.viewProducts") : "View Products"}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{t("products")}</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              {category.name}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {t
              .raw("productsInCategory")
              .replace("{count}", category?.productCount?.toString() || "0")}
          </DialogDescription>
        </DialogHeader>

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
                  {/* <TableHead className="w-[80px]">{t("id")}</TableHead> */}
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("sku")}</TableHead>
                  <TableHead className="text-right">{t("price")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length! > 0 ? (
                  products?.map((product: Product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      {/* <TableCell className="font-mono text-xs text-muted-foreground">
                        {product.uuid}
                      </TableCell> */}
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {product.sku}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.salePrice)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t("noProductsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
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
