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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExpenseStore } from "@/stores/expenses.store";
import { useExpenseCategories } from "../../hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useExpenseSubCategories } from "../../hooks/useSubCategories";

interface ExpenseSubCategoryEditFormProps {
  subCategoryData: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  onCancel?: () => void;
}

export const ExpenseSubCategoryEditForm: React.FC<
  ExpenseSubCategoryEditFormProps
> = ({ subCategoryData, onCancel }) => {
  const { expenseCategories, isLoading } = useExpenseCategories();
  const { mutate } = useExpenseSubCategories();
  const { updateSubCategory } = useExpenseStore();
  const t = useTranslations("ExpenseSubCategories.form");
  const { toast } = useToast();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
        category: z.string().min(1, "Category is required"),
      })
    ),
    defaultValues: {
      name: subCategoryData.name || "",
      category: subCategoryData.category.id || "",
    },
  });

  // Reset form when categoryData changes
  React.useEffect(() => {
    if (subCategoryData) {
      form.reset({
        name: subCategoryData.name || "",
        category: subCategoryData.category.id || "",
      });
    }
  }, [subCategoryData, form]);

  const onSubmit = async (data: { name: string; category: string }) => {
    if (!session?.accessToken || !organizationId) return;
    try {
      const response = await updateSubCategory({
        id: subCategoryData.id,
        name: data.name,
        categoryId: data.category,
        accessToken: session?.accessToken!,
      });
      if (response.error) {
        toast({
          title: "Error",
          description:
            "Failed to update expense sub category. Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Expense sub category updated successfully.",
      });
      mutate();
      onCancel?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense sub category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
