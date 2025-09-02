// components/purchase-form/SupplierSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select";
import { PurchaseFormValues } from "@/lib/schemas/purchase-schema";
import { TERMS_OPTIONS } from "@/types/purchases.type";

interface SupplierSectionProps {
  form: UseFormReturn<PurchaseFormValues>;
  suppliers: Array<{ id: string; email: string }>;
  t: (key: string) => string;
}

export const SupplierSection = ({ form, suppliers, t }: SupplierSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newPurchase.sections.supplierInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="supplier.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPurchase.fields.supplierEmail")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("newPurchase.placeholders.supplierEmail")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.email}>
                        {supplier.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPurchase.fields.terms")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("newPurchase.placeholders.selectTerms")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TERMS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};