import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select";
import { SaleFormValues } from "@/lib/schemas/sale-schema";
import { TERMS_OPTIONS } from "@/types/sales.type";

interface CustomerSectionProps {
  form: UseFormReturn<SaleFormValues>;
  customers: Array<{ id: string; email: string }>;
  t: (key: string) => string;
}

export const CustomerSection = ({ form, customers, t }: CustomerSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newSale.sections.customerInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customer.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newSale.fields.customerEmail")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("newSale.placeholders.customerEmail")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.email}>
                        {customer.email}
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
                <FormLabel>{t("newSale.fields.terms")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("newSale.placeholders.selectTerms")} />
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