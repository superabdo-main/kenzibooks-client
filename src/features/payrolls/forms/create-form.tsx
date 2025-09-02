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
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EmployeePaySchedule } from "@/types/employee.type";


interface PayrollScheduleFormProps {
  onCancel?: () => void;
  onSubmit?: (data: EmployeePaySchedule) => Promise<void>;
}

export const PayrollScheduleForm: React.FC<PayrollScheduleFormProps> = ({ 
  onCancel, 
  onSubmit 
}) => {
  const t = useTranslations("Employee.form");
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // Zod schema for payroll schedule
  const payrollScheduleSchema = z.object({
    payFrequency: z.string().min(1, "Pay frequency is required"),
    nextPayDate: z.string().min(1, "Next pay date is required"),
    taxes: z.string().min(0, "Taxes must be a non-negative number"),
    isDefault: z.boolean().default(false),
  });

  type PayrollScheduleFormValues = z.infer<typeof payrollScheduleSchema>;

  const form = useForm<PayrollScheduleFormValues>({
    resolver: zodResolver(payrollScheduleSchema),
    defaultValues: {
      payFrequency: "",
      nextPayDate: "",
      taxes: "0",
      isDefault: false,
    },
  });

  const handleSubmit = async (data: PayrollScheduleFormValues) => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const scheduleData: EmployeePaySchedule = {
        payFrequency: data.payFrequency,
        nextPayDate: new Date(data.nextPayDate),
        taxes: Number(data.taxes),
        isDefault: data.isDefault,
      };

      if (onSubmit) {
        await onSubmit(scheduleData);
      }

      toast({
        title: "Success",
        description: "Payroll schedule created successfully.",
      });
      
      form.reset();
      onCancel?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payroll schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Pay Frequency */}
              <FormField
                control={form.control}
                name="payFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("payFrequency.label")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pay frequency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next Pay Date */}
              <FormField
                control={form.control}
                name="nextPayDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("nextPayDate.label")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Taxes */}
              <FormField
                control={form.control}
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("taxes.label")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter taxes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Default */}
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t("isDefault.label")}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Set this as the default payroll schedule
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("buttons.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PayrollScheduleForm;