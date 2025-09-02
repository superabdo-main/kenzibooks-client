import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn-ui/button";
import { CardFooter } from "@/components/shadcn-ui/card";
import {
  PurchaseFormValues,
  purchaseFormSchema,
} from "@/lib/schemas/purchase-schema";
import { SupplierSection } from "./SupplierSection";
import { AddressesSection } from "./AddressesSection";
import { DatesSection } from "./DatesSection";
import { ItemsSection } from "./ItemsSection";
import { SummarySection } from "./SummarySection";
import { usePurchaseCalculations } from "@/features/purchases/hooks/usePurchaseCalculations";
import { Product } from "@/types/products.type";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SupplierType } from "@/types/suppliers.type";
import { PurchaseType } from "@/types/purchases.type";

interface PurchaseFormProps {
  type: 'PURCHASE' | 'PURCHASE_ESTIMATES' | 'DEBIT_NOTE' | 'BILL';
  suppliers: SupplierType[];
  products: Product[];
  defaultValues?: Partial<PurchaseFormValues>;
  onSubmit: (data: PurchaseType) => Promise<void>;
  t: (key: string) => string;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export const PurchaseForm = ({
  type,
  suppliers,
  products,
  defaultValues,
  onSubmit,
  t,
  isEdit = false,
  isSubmitting = false,
}: PurchaseFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // Define default values outside of useForm to ensure they're stable
  const defaultFormValues: PurchaseFormValues = {
    supplier: {
      email: "",
    },
    paymentTerm: "DUE_ON_RECEIPT",
    purchaseDate: new Date(Date.now()).toISOString().split("T")[0],
    expectedShipmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
    address: {
      billingStreet: "",
      billingCity: "",
      billingState: "",
      billingZipPostalCode: "",
      billingCountry: "",
      shippingStreet: "",
      shippingCity: "",
      shippingState: "",
      shippingZipPostalCode: "",
      shippingCountry: "",
    },
    items: [],
    subTotal: 0,
    salesTaxes: 0,
    salesTaxRate: 0,
    discount: 0,
    discountRate: 0,
    grandTotal: 0,
    notes: "",
  };

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      ...defaultFormValues,
      ...(defaultValues || {}),
      // Ensure nested objects are properly merged
      address: {
        ...defaultFormValues.address,
        ...(defaultValues?.address || {}),
      },
      // formate the coming dates to yyyy-MM-dd
      purchaseDate: defaultValues?.purchaseDate ? new Date(defaultValues?.purchaseDate).toISOString().split("T")[0] : new Date(Date.now()).toISOString().split("T")[0],
      expectedShipmentDate: defaultValues?.expectedShipmentDate ? new Date(defaultValues?.expectedShipmentDate).toISOString().split("T")[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      // Ensure items array is properly initialized
      items: defaultValues?.items?.length
        ? defaultValues.items.map((item) => ({
            productId: item.productId || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: item.total || 0,
          }))
        : [...defaultFormValues.items],
    },
  });

  const { calculateItemTotal, calculateTotals } = usePurchaseCalculations(form);

  const handleItemChange = (index: number) => {
    calculateItemTotal(index);
    calculateTotals();
  };

  const handleSubmit = async (data: PurchaseFormValues) => {

    const requestData = {
      ...data,
      supplierId: suppliers.find(
        (supplier) => supplier.email === data.supplier.email
      )?.id,
      type: type,
      purchaseDate: new Date(data.purchaseDate),
      expectedShipmentDate: new Date(data.expectedShipmentDate),
    };

    await onSubmit(requestData);
  };

  const methods = form;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <SupplierSection form={form} suppliers={suppliers} t={t} />

          <DatesSection form={form} t={t} />

          <AddressesSection form={form} t={t} />

          {!isEdit && <ItemsSection
            form={form}
            products={products}
            onItemChange={handleItemChange}
            t={t}
          />}

          <SummarySection form={form} t={t} />
        </div>

        <CardFooter className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t("newPurchase.buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit
              ? t("editPurchase.buttons.save")
              : t("newPurchase.buttons.save")}
          </Button>
        </CardFooter>
      </form>
    </FormProvider>
  );
};

export default PurchaseForm;
