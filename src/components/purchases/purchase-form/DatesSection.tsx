// components/purchase-form/DatesSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { PurchaseFormValues } from "@/lib/schemas/purchase-schema";

interface DatesSectionProps {
  form: UseFormReturn<PurchaseFormValues>;
  t: (key: string) => string;
}

export const DatesSection = ({ form, t }: DatesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newPurchase.sections.dates")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPurchase.fields.purchaseDate")}</FormLabel>
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
                <FormLabel>{t("newPurchase.fields.expectedShipmentDate")}</FormLabel>
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