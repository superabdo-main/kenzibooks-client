// components/purchase-form/DatesSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { SaleFormValues } from "@/lib/schemas/sale-schema";

interface DatesSectionProps {
  form: UseFormReturn<SaleFormValues>;
  t: (key: string) => string;
}

export const DatesSection = ({ form, t }: DatesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newSale.sections.dates")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="saleDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newSale.fields.saleDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedShipmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newSale.fields.expectedShipmentDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};