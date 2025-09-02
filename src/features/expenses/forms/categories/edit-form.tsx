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
import { useToast } from "@/hooks/use-toast";
import { useExpenseStore } from "@/stores/expenses.store";
import { useExpenseCategories } from "../../hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

interface ExpenseCategoryEditFormProps {
  categoryData: {
    id: string;
    name: string;
  };
  onCancel?: () => void;
}

export const ExpenseCategoryEditForm: React.FC<
  ExpenseCategoryEditFormProps
> = ({ categoryData, onCancel }) => {
  const { mutate } = useExpenseCategories();
  const { updateCategory } = useExpenseStore();
  const t = useTranslations("ExpenseCategories.form");
  const { toast } = useToast();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
      })
    ),
    defaultValues: {
      name: categoryData.name || "",
    },
  });

  // Reset form when categoryData changes
  React.useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name || "",
      });
    }
  }, [categoryData, form]);

  const onSubmit = async (data: { name: string }) => {
    if (!session?.accessToken || !organizationId) return;
    try {
      const response = await updateCategory({
        id: categoryData.id,
        name: data.name,
        accessToken: session?.accessToken!,
        organizationId: organizationId,
      });
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to update expense category. Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Expense category updated successfully.",
      });
      mutate();
      onCancel?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="w-full">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter expense category name"
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t("edit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
