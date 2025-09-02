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
import { Textarea } from "@/components/shadcn-ui/textarea";
import { useCustomersStore } from "@/stores/customers.store";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DepositFormProps {
  customerId: string;
  onCancel?: () => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({
  customerId,
  onCancel,
}) => {
  const t = useTranslations("Customers.depositForm");
  const { addDeposit, isLoading } = useCustomersStore();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { session } = useAuth();
  const { toast } = useToast();

  // Zod schema with translation messages (must be inside the component to access 't')
  const depositFormSchema = z.object({
    paymentDate: z.string().min(1, t("paymentDate.required")),
    paidBy: z.string().min(1, t("paidBy.required")),
    amount: z.coerce.number().min(0.01, t("amount.min")),
    note: z.string().optional(),
  });

  type DepositFormValues = z.infer<typeof depositFormSchema>;

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      paymentDate: "",
      paidBy: "",
      amount: 0,
      note: "",
    },
  });

  const onSubmit = async (data: DepositFormValues) => {
    if (!session?.accessToken || !organizationId) return;
    try {
      const response = await addDeposit({
        id: customerId,
        deposit: data,
        organizationId: organizationId!,
        accessToken: session?.accessToken!,
      });
      if (response.error) {
        toast({
          title: t("error.title"),
          description: t("error.description"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("success.title"),
          description: t("success.description"),
        });
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      });
    }
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
                      <Input
                        type="date"
                        placeholder={t("paymentDate.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payed By */}
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paidBy.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("paidBy.placeholder")}
                        {...field}
                      />
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
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
                      <Textarea
                        placeholder={t("note.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>{t("buttons.save")}</Button>
        </div>
      </form>
    </Form>
  );
};

export default DepositForm;
