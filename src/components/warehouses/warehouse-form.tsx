"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Warehouse } from "@/stores/warehouses.store";
import { LoadingButton } from "@/components/ui/loading-button";

interface WarehouseFormProps {
  initialData?: Warehouse;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  isSubmitting?: boolean;
}

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export function WarehouseForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: WarehouseFormProps) {
  const t = useTranslations("Warehouses");

  // Initialize form with initial data or defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.warehouseName")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("form.warehouseNamePlaceholder")} 
                  {...field} 
                  className="bg-background"
                />
              </FormControl>
              <FormDescription>
                {t("form.warehouseNameDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <LoadingButton 
            type="submit" 
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {initialData ? t("form.updateWarehouse") : t("form.createWarehouse")}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
} 