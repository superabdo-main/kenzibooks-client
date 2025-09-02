"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn-ui/dialog";
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
import { Textarea } from "@/components/shadcn-ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { useRevenue } from "@/features/revenue/hooks/useRevenue";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface RevenueModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const RevenueModal: React.FC<RevenueModalProps> = ({
  trigger,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Revenue.form");
  const { createRevenue, categories, isCategoriesLoading } = useRevenue();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { session } = useAuth();
  const { toast } = useToast();

  // Zod schema for revenue form validation
  const revenueFormSchema = z.object({
    amount: z.coerce
      .number()
      .min(0.01, t("validation.amountMin") || "Amount must be at least 0.01"),
    date: z.string().min(1, t("validation.dateRequired") || "Date is required"),
    description: z
      .string()
      .optional()
      .transform((val) => val || undefined),
    mainCategoryId: z
      .string()
      .optional()
      .transform((val) => val || undefined),
    categoryId: z
      .string()
      .optional()
      .transform((val) => val || undefined),
  });

  type RevenueFormValues = z.infer<typeof revenueFormSchema>;

  const form = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueFormSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0], // Today's date
      description: "",
      mainCategoryId: "",
      categoryId: "",
    },
  });

  const onSubmit = async (data: RevenueFormValues) => {
    if (!session?.accessToken || !organizationId) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      });
      return;
    }

    try {
      const revenueData = {
        amount: data.amount,
        date: data.date,
        description: data.description,
        categoryId: data.categoryId,
        organizationId: organizationId,
      };

      const response = await createRevenue(revenueData);

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to create revenue. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Revenue created successfully.",
        });
        form.reset();
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create revenue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  // Watch for main category changes
  const selectedMainCategoryId = form.watch("mainCategoryId");

  // Reset subcategory when main category changes
  useEffect(() => {
    if (selectedMainCategoryId) {
      form.setValue("categoryId", "");
    }
    console.log(selectedMainCategoryId)
  }, [selectedMainCategoryId, form]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("new") || "New Revenue"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title") || "New Revenue"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("amount") || "Amount"}</FormLabel>
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

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("date") || "Date"}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description") || "Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        t("descriptionPlaceholder") ||
                        "Enter revenue description (optional)"
                      }
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Main Category Selection */}
            <FormField
              control={form.control}
              name="mainCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("mainCategory") || "Main Category"}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isCategoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isCategoriesLoading
                              ? "Loading categories..."
                              : t("mainCategoryPlaceholder") ||
                                "Select main category (optional)"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
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

            {/* Subcategory Selection - Only show if main category is selected */}
            {selectedMainCategoryId && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subCategory") || "Sub Category"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedMainCategoryId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              t("subCategoryPlaceholder") ||
                              "Select sub category (optional)"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.find((item) => item.id === selectedMainCategoryId)?.subCategories.map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={form.formState.isSubmitting}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("saving") || "Saving..."
                  : t("save") || "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueModal;
