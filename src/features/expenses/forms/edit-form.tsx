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
import { useExpenseStore } from "@/stores/expenses.store";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useExpenseCategories } from "../hooks/useCategories";
import { useExpenses } from "../hooks/useExpenses";

// Define the expense data type
interface ExpenseData {
  id: string;
  reference: string;
  type: "FIXED" | "RECURRING";
  expenseFor: string;
  amount: number;
  category: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
    categoryId: string;
  };
  repeatEvery?: number;
  startDate: string | Date;
}

interface ExpenseEditFormProps {
  expenseData: ExpenseData;
  onCancel?: () => void;
}

export const ExpenseEditForm: React.FC<ExpenseEditFormProps> = ({
  expenseData,
  onCancel,
}) => {
  const { mutate } = useExpenses();

  const t = useTranslations("Expenses.form");
  const { updateExpense, isLoading } = useExpenseStore();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { session } = useAuth();
  const { toast } = useToast();
  const { expenseCategories } = useExpenseCategories();

  // Zod schema with translation messages (must be inside the component to access 't')
  const expenseFormSchema = z
    .object({
      reference: z.string().min(1, "Reference is required"),
      type: z.enum(["FIXED", "RECURRING"], {
        required_error: "Type is required",
      }),
      expenseFor: z.string().min(1, "Expense For is required"),
      amount: z.coerce.number().min(0.01, "Amount must be at least 0.01"),
      category: z.string().min(1, "Category is required"),
      subCategory: z.string().min(1, "Sub Category is required"),
      repeatEvery: z.coerce
        .number()
        .min(1, "Repeat Every must be at least 1")
        .optional(),
      startDate: z.string().min(1, "Start Date is required"),
    })
    .refine(
      (data) => {
        // If type is RECURRING, repeatEvery is required
        if (data.type === "RECURRING" && !data.repeatEvery) {
          return false;
        }
        return true;
      },
      {
        message: "Repeat Every is required for recurring expenses",
        path: ["repeatEvery"],
      }
    );

  type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

  // Helper function to format date for input
  const formatDateForInput = (date: string | Date): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      reference: expenseData.reference || "",
      type: expenseData.type || "FIXED",
      expenseFor: expenseData.expenseFor || "",
      amount: expenseData.amount || 0,
      category: expenseData.category.category?.id || "",
      subCategory: expenseData.category?.id || "",
      repeatEvery: expenseData.repeatEvery || undefined,
      startDate: formatDateForInput(expenseData.startDate) || "",
    },
  });

  const selectedCategory = form.watch("category");
  const selectedType = form.watch("type");

  // Reset subcategory when category changes (but not on initial load)
  React.useEffect(() => {
    if (selectedCategory && selectedCategory !== expenseData.category?.id) {
      form.setValue("subCategory", "");
    }
  }, [selectedCategory, form, expenseData.category?.id]);

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!session?.accessToken || !organizationId) return;

    try {
      const expenseUpdateData = {
        id: expenseData.id,
        reference: data.reference,
        type: data.type,
        expenseFor: data.expenseFor,
        amount: data.amount,
        categoryId: data.subCategory,
        startDate: new Date(data.startDate),
        organizationId: organizationId,
        repeatEvery: data.type === "RECURRING" ? data.repeatEvery : undefined,
      };

      const response = await updateExpense({
        expenseData: expenseUpdateData,
        accessToken: session?.accessToken!,
      });

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to update expense. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Expense updated successfully.",
        });
        mutate();
        onCancel?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reference")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expense type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                        <SelectItem value="RECURRING">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expense For */}
              <FormField
                control={form.control}
                name="expenseFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("expenseFor")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What is this expense for?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
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

              {/* Sub Category */}
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subCategory")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!selectedCategory}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory &&
                          expenseCategories
                            ?.find(
                              (category) => category.id === selectedCategory
                            )
                            ?.subCategories.map((subCategory) => (
                              <SelectItem
                                key={subCategory.id}
                                value={subCategory.id}
                              >
                                {subCategory.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Repeat Every - Only show if type is RECURRING */}
              {selectedType === "RECURRING" && (
                <FormField
                  control={form.control}
                  name="repeatEvery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("repeatEvery")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="30"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("startDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("edit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseEditForm;
