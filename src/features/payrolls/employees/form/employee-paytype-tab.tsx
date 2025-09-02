"use client";

import React from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { DollarSign, Clock, Calendar as CalendarDays } from "lucide-react";
import { EmployeeFormValues } from "./schema";
import { EmployeePaymentTypeOptions } from "@/types/employee.type";
import { usePayrollInitials } from "../../hooks/useInitials";

interface EmployeePayTypeTabProps {
  control: Control<EmployeeFormValues>;
}

export const EmployeePayTypeTab: React.FC<EmployeePayTypeTabProps> = ({
  control,
}) => {
  const t = useTranslations("Employee.form");
  const { payrolls, isLoading } = usePayrollInitials();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Pay Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.paySchedule")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="paySchedule.payFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("payFrequency.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("payFrequency.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {payrolls?.map((frequency) => (
                          <SelectItem key={frequency.id} value={frequency.id}>
                            {frequency.payFrequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("payFrequency.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Pay Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.payType")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="payTypes.payType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("payType.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("payType.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EmployeePaymentTypeOptions).map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {t(`payType.options.${type.toLowerCase()}`)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("payType.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payTypes.ratePerHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ratePerHour.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={t("ratePerHour.placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("ratePerHour.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payTypes.salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("salary.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={t("salary.placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>{t("salary.description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payTypes.hourPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("hourPerDay.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={t("hourPerDay.placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("hourPerDay.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payTypes.dayPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dayPerWeek.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          max="7"
                          placeholder={t("dayPerWeek.placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("dayPerWeek.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
