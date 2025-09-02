// components/purchase-form/AddressesSection.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Separator } from "@/components/shadcn-ui/separator";
import { AddressForm } from "./AddressForm";
import { PurchaseFormValues } from "@/lib/schemas/purchase-schema";

interface AddressesSectionProps {
  form: UseFormReturn<PurchaseFormValues>;
  t: (key: string) => string;
}

export const AddressesSection = ({ form, t }: AddressesSectionProps) => {
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const billingAddress = form.watch("address");

  useEffect(() => {
    if (useShippingAsBilling) {
      form.setValue("address.shippingStreet", billingAddress.billingStreet);
      form.setValue("address.shippingCity", billingAddress.billingCity);
      form.setValue("address.shippingState", billingAddress.billingState);
      form.setValue("address.shippingZipPostalCode", billingAddress.billingZipPostalCode);
      form.setValue("address.shippingCountry", billingAddress.billingCountry);
    }
  }, [useShippingAsBilling, billingAddress, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newPurchase.sections.addresses")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("newPurchase.fields.billingAddress")}
          </h3>
          <AddressForm
            form={form}
            addressType="billing"
            t={t}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="copy-billing"
            checked={useShippingAsBilling}
            onCheckedChange={(checked) => setUseShippingAsBilling(!!checked)}
          />
          <label
            htmlFor="copy-billing"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            {t("newPurchase.fields.copyBillingAddress")}
          </label>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("newPurchase.fields.shippingAddress")}
          </h3>
          <AddressForm
            form={form}
            addressType="shipping"
            disabled={useShippingAsBilling}
            t={t}
          />
        </div>
      </CardContent>
    </Card>
  );
};