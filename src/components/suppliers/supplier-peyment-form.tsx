"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select";
import { Textarea } from "@/components/shadcn-ui/textarea";

// Payment type options
const paymentTypes = [
  { value: "cash", key: "cash" },
  { value: "paytm", key: "paytm" },
  { value: "card", key: "card" },
  { value: "finance", key: "finance" },
] as const;

interface SupplierPaymentFormProps {
  defaultValues?: any;
  onCancel?: () => void;
}

export const SupplierPaymentForm: React.FC<SupplierPaymentFormProps> = ({
  defaultValues,
  onCancel,
}) => {
  const t = useTranslations("Suppliers.paymentForm");

  // Zod schema with translation messages (must be inside the component to access 't')
  const supplierPaymentFormSchema = z.object({
    paymentDate: z.string().min(1, t("paymentDate.required")),
    reference: z.string().min(1, t("reference.required")),
    amount: z.coerce.number().min(0.01, t("amount.min")),
    paymentType: z.enum(["cash", "paytm", "card", "finance"], {
      required_error: t("paymentType.required"),
    }),
    note: z.string().optional(),
  });

  type SupplierPaymentFormValues = z.infer<typeof supplierPaymentFormSchema>;

  const form = useForm<SupplierPaymentFormValues>({
    resolver: zodResolver(supplierPaymentFormSchema),
    defaultValues: {
      paymentDate: "",
      reference: "",
      amount: 0,
      paymentType: undefined,
      note: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: SupplierPaymentFormValues) => {
    // Replace with actual save logic
    // For now, just log the data
    // eslint-disable-next-line no-console
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Payment Date */}
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentDate.label")}</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder={t("paymentDate.placeholder")}
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference Number */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reference.label")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("reference.placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("amount.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder={t("amount.placeholder")}
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Type */}
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentType.label")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("paymentType.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {t(`paymentType.${type.key}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("note.label")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("note.placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("buttons.cancel")}
          </Button>
          <Button type="submit">{t("buttons.save")}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierPaymentForm;
