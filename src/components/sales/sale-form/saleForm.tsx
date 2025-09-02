import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn-ui/button";
import { CardFooter } from "@/components/shadcn-ui/card";
import {
  SaleFormValues,
  saleFormSchema,
} from "@/lib/schemas/sale-schema";
import { AddressesSection } from "./AddressesSection";
import { DatesSection } from "./DatesSection";
import { ItemsSection } from "./ItemsSection";
import { SummarySection } from "./SummarySection";
import { Product } from "@/types/products.type";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomerType } from "@/types/customers";
import { SaleType } from "@/types/sales.type";
import { useSaleCalculations } from "@/features/sales/hooks/useSaleCalculations";
import { CustomerSection } from "./CustomerSection";

interface SaleFormProps {
  type: 'SALE' | 'ESTIMATED_SALE' | 'INVOICE' | 'CREDIT_NOTE';
  customers: CustomerType[];
  products: Product[];
  defaultValues?: Partial<SaleFormValues>;
  onSubmit: (data: SaleType) => Promise<void>;
  t: (key: string) => string;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export const SaleForm = ({
  type,
  customers,
  products,
  defaultValues,
  onSubmit,
  t,
  isEdit = false,
  isSubmitting = false,
}: SaleFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // Define default values outside of useForm to ensure they're stable
  const defaultFormValues: SaleFormValues = {
    customer: {
      email: "",
    },
    paymentTerm: "DUE_ON_RECEIPT",
    saleDate: new Date(Date.now()).toISOString().split("T")[0],
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

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      ...defaultFormValues,
      ...(defaultValues || {}),
      // Ensure nested objects are properly merged
      address: {
        ...defaultFormValues.address,
        ...(defaultValues?.address || {}),
      },
      // formate the coming dates to yyyy-MM-dd
      saleDate: defaultValues?.saleDate ? new Date(defaultValues?.saleDate).toISOString().split("T")[0] : new Date(Date.now()).toISOString().split("T")[0],
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

  const { calculateItemTotal, calculateTotals } = useSaleCalculations(form);

  const handleItemChange = (index: number) => {
    calculateItemTotal(index);
    calculateTotals();
  };

  const handleSubmit = async (data: SaleFormValues) => {

    const requestData = {
      ...data,
      customerId: customers.find(
        (customer) => customer.email === data.customer.email
      )?.id,
      type: type,
      saleDate: new Date(data.saleDate),
      expectedShipmentDate: new Date(data.expectedShipmentDate),
    };

    await onSubmit(requestData);
  };

  const methods = form;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <CustomerSection form={form} customers={customers} t={t} />

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
            {t("newSale.buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit
              ? t("editSale.buttons.save")
              : t("newSale.buttons.save")}
          </Button>
        </CardFooter>
      </form>
    </FormProvider>
  );
};

export default SaleForm;
