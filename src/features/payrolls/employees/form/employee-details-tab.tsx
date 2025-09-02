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
import { Calendar } from "@/components/shadcn-ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { Button } from "@/components/shadcn-ui/button";
import { CalendarIcon, User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EmployeeFormValues } from "./schema";
import { EmployeeStatus } from "@/types/employee.type";

interface EmployeeDetailsTabProps {
  control: Control<EmployeeFormValues>;
}

export const EmployeeDetailsTab: React.FC<EmployeeDetailsTabProps> = ({
  control,
}) => {
  const t = useTranslations("Employee.form");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* <FormField
              control={control}
              name="details.employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employeeId.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("employeeId.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("employeeId.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={control}
              name="details.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name.label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("name.placeholder")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("name.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email.label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={t("email.placeholder")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("email.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone.label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("phone.placeholder")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("phone.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.SSN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ssn.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ssn.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("ssn.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status.label")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("status.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(EmployeeStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`status.options.${status.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("status.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.hireDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("hireDate.label")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("hireDate.placeholder")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {t("hireDate.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("jobTitle.label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("jobTitle.placeholder")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("jobTitle.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.workLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workLocation.label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("workLocation.placeholder")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("workLocation.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="details.workerCompClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workerCompClass.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("workerCompClass.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("workerCompClass.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("sections.address")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="details.address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("address.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("address.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("address.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="details.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("city.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("city.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="details.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("state.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("state.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="details.postCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("postCode.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("postCode.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="details.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("country.placeholder")}
                        {...field}
                      />
                    </FormControl>
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