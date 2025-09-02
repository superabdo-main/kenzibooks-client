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
import { Category } from "@/stores/categories.store";
import { LoadingButton } from "@/components/ui/loading-button";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  isSubmitting?: boolean;
}

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormProps) {
  const t = useTranslations("Common");

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
              <FormLabel>{t("categoryName")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("categoryNamePlaceholder")} 
                  {...field} 
                  className="bg-background"
                />
              </FormControl>
              <FormDescription>
                {t("categoryNameDescription")}
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
            {initialData ? t("updateCategory") : t("createCategory")}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
} 