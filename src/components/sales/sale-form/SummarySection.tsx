// components/purchase-form/SummarySection.tsx
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { SaleFormValues } from "@/lib/schemas/sale-schema";

interface SummarySectionProps {
  form: UseFormReturn<SaleFormValues>;
  t: (key: string) => string;
}

export const SummarySection = ({ form, t }: SummarySectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newSale.sections.summary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="subTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newSale.fields.subtotal")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={field.value?.toFixed(2) || "0.00"}
                      className="bg-muted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salesTaxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newSale.fields.salesTax")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salesTaxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newSale.fields.salesTaxAmount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={field.value || "0.00"}
                      className="bg-muted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="discountRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newSale.fields.discount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newSale.fields.discountAmount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={field.value?.toFixed(2) || "0.00"}
                      className="bg-muted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grandTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {t("newSale.fields.grandTotal")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={field.value?.toFixed(2) || "0.00"}
                      className="bg-muted font-bold text-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};