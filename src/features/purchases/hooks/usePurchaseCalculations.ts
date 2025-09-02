// hooks/usePurchaseCalculations.ts
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormValues } from "@/lib/schemas/purchase-schema";

export const usePurchaseCalculations = (form: UseFormReturn<PurchaseFormValues>) => {
  const watchItems = form.watch("items");
  const watchSalesTaxRate = form.watch("salesTaxRate") || 0;
  const watchDiscountRate = form.watch("discountRate") || 0;

  const calculateItemTotal = (index: number) => {
    const item = watchItems?.[index];
    if (!item) return;

    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const total = quantity * unitPrice;

    form.setValue(`items.${index}.total`, Number(total.toFixed(2)), {
      shouldValidate: true,
    });
  };

  const calculateTotals = () => {
    const subtotal = watchItems?.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const taxAmount = (subtotal * Number(watchSalesTaxRate)) / 100;
    const discountAmount = (subtotal  * Number(watchDiscountRate)) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;
    form.setValue("subTotal", Number(subtotal?.toFixed(2)));
    form.setValue("salesTaxes", Number(taxAmount.toFixed(2)));
    form.setValue("discount", Number(discountAmount.toFixed(2)));
    form.setValue("grandTotal", Number(grandTotal.toFixed(2)));
  };

  useEffect(() => {
    watchItems?.forEach((_, index) => calculateItemTotal(index));
    calculateTotals();
  }, [watchItems, watchSalesTaxRate, watchDiscountRate]);

  return { calculateItemTotal, calculateTotals };
};