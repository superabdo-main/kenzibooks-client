// components/purchase-form/AddressForm.tsx
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { PurchaseFormValues } from "@/lib/schemas/purchase-schema";

interface AddressFormProps {
  form: UseFormReturn<PurchaseFormValues>;
  addressType: "billing" | "shipping";
  disabled?: boolean;
  t: (key: string) => string;
}

export const AddressForm = ({ form, addressType, disabled = false, t }: AddressFormProps) => {
  const prefix = addressType === "billing" ? "billing" : "shipping";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`address.${addressType}Street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`newPurchase.fields.${prefix}Street`)}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(`newPurchase.placeholders.${prefix}Street`)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`address.${addressType}City`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`newPurchase.fields.${prefix}City`)}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(`newPurchase.placeholders.${prefix}City`)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`address.${addressType}State`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`newPurchase.fields.${prefix}State`)}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(`newPurchase.placeholders.${prefix}State`)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`address.${addressType}ZipPostalCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`newPurchase.fields.${prefix}Zip`)}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(`newPurchase.placeholders.${prefix}Zip`)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`address.${addressType}Country`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`newPurchase.fields.${prefix}Country`)}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(`newPurchase.placeholders.${prefix}Country`)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};