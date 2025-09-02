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
import { RadioGroup, RadioGroupItem } from "@/components/shadcn-ui/radio-group";
import { Label } from "@/components/shadcn-ui/label";
import { CreditCard, Building, Hash } from "lucide-react";
import { EmployeeFormValues } from "./schema";

interface EmployeePaymentTabProps {
  control: Control<EmployeeFormValues>;
}

export const EmployeePaymentTab: React.FC<EmployeePaymentTabProps> = ({
  control,
}) => {
  const t = useTranslations("Employee.form");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Payment Deposit Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.paymentDeposit")}</h3>
            <FormField
              control={control}
              name="paymentMethods.paymentDeposit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("paymentDeposit.label")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DIRECT_DEPOSIT" id="direct-deposit" />
                        <Label htmlFor="direct-deposit" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {t("paymentDeposit.options.directDeposit")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PAPER_CHECK" id="paper-check" />
                        <Label htmlFor="paper-check" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {t("paymentDeposit.options.paperCheck")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {t("paymentDeposit.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Direct Deposit Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.directDeposit")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="paymentMethods.directDepositMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("directDepositMethod.label")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("directDepositMethod.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONE_ACCOUNT">
                          {t("directDepositMethod.options.oneAccount")}
                        </SelectItem>
                        <SelectItem value="MULTIPLE_ACCOUNTS">
                          {t("directDepositMethod.options.multipleAccounts")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("directDepositMethod.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="paymentMethods.accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("accountType.label")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("accountType.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SAVING">
                          {t("accountType.options.saving")}
                        </SelectItem>
                        <SelectItem value="CHECKING">
                          {t("accountType.options.checking")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("accountType.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="paymentMethods.routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("routingNumber.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t("routingNumber.placeholder")}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("routingNumber.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="paymentMethods.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("accountNumber.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t("accountNumber.placeholder")}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("accountNumber.description")}
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