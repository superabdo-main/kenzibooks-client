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
import { useExpenseStore } from "@/stores/expenses.store";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useExpenseCategories } from "../../hooks/useCategories";

interface ExpenseCategoryFormProps {
  onCancel?: () => void;
}

export const ExpenseCategoryForm: React.FC<ExpenseCategoryFormProps> = ({
  onCancel,
}) => {
  const t = useTranslations("ExpenseCategories");
  const { createCategory, isLoading } = useExpenseStore();
  const { mutate } = useExpenseCategories();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { session } = useAuth();
  const { toast } = useToast();

  // Zod schema with translation messages (must be inside the component to access 't')
  const expenseFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!session?.accessToken || !organizationId) return;

    try {
      const response = await createCategory({
        name: data.name,
        accessToken: session?.accessToken!,
        organizationId: organizationId,
      });

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to create expense category. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Category created successfully.",
        });
        form.reset();
        mutate();
        onCancel?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create expense category. Please try again.",
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
                    <FormLabel>{t("form.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
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
            disabled={isLoading}
          >
            {t("form.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("form.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseCategoryForm;
