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
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Separator } from "@/components/shadcn-ui/separator";
import { 
  DollarSign, 
  Clock, 
  Gift, 
  TrendingUp, 
  Car, 
  Heart, 
  Home, 
  Briefcase,
  CreditCard,
  Receipt,
  Coffee,
  Shield
} from "lucide-react";
import { EmployeeFormValues } from "./schema";

interface EmployeePayTypesTabProps {
  control: Control<EmployeeFormValues>;
}

export const EmployeePayTypesTab: React.FC<EmployeePayTypesTabProps> = ({
  control,
}) => {
  const t = useTranslations("Employee.form");

  const commonPayTypes = [
    { name: "overtimePay", icon: Clock, key: "overtimePay" },
    { name: "doubleOvertimePay", icon: Clock, key: "doubleOvertimePay" },
    { name: "holidayBonus", icon: Gift, key: "holidayBonus" },
    { name: "bonus", icon: TrendingUp, key: "bonus" },
    { name: "commission", icon: DollarSign, key: "commission" },
  ];

  const additionalPayTypes = [
    { name: "allowance", icon: DollarSign, key: "allowance" },
    { name: "reimbursement", icon: Receipt, key: "reimbursement" },
    { name: "cashTips", icon: DollarSign, key: "cashTips" },
    { name: "payCheckTips", icon: CreditCard, key: "payCheckTips" },
    { name: "clergyHousingCash", icon: Home, key: "clergyHousingCash" },
    { name: "clergyHousingInHand", icon: Home, key: "clergyHousingInHand" },
    { name: "nontaxablePerDiem", icon: Coffee, key: "nontaxablePerDiem" },
    { name: "groupTermLifeInsurance", icon: Shield, key: "groupTermLifeInsurance" },
    { name: "sCorpOwnerHealthInsurance", icon: Heart, key: "sCorpOwnerHealthInsurance" },
    { name: "companyHSAContributions", icon: Heart, key: "companyHSAContributions" },
    { name: "personalUseOfCompanyCar", icon: Car, key: "personalUseOfCompanyCar" },
    { name: "bereavementPay", icon: Heart, key: "bereavementPay" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Common Pay Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.commonPayTypes")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {commonPayTypes.map((payType) => (
                <FormField
                  key={payType.key}
                  control={control}
                  name={`commonPayTypes.${payType.key}` as any}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <payType.icon className="h-4 w-4" />
                          {t(`commonPayTypes.options.${payType.key}`)}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Pay Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.additionalPayTypes")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {additionalPayTypes.map((payType) => (
                <FormField
                  key={payType.key}
                  control={control}
                  name={`additionalPayTypes.${payType.key}` as any}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <payType.icon className="h-4 w-4" />
                          {t(`additionalPayTypes.options.${payType.key}`)}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};