"use client";

import React, { useState } from "react";
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
import { useTaxStore } from "@/stores/tax.store";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTaxes } from "../hooks/useTaxes";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/shadcn-ui/radio-group";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { ScrollArea } from "@/components/shadcn-ui/scroll-area";

interface TaxFormProps {
  onCancel?: () => void;
}

export const TaxCreateForm: React.FC<TaxFormProps> = ({ onCancel }) => {
  const t = useTranslations("SalesTax");
  const { createTax, isLoading } = useTaxStore();
  const { mutate } = useTaxes();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { session } = useAuth();
  const { toast } = useToast();
  const { products } = useProducts();

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Zod schema with validation
  const taxFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rate: z.coerce
      .number()
      .min(0, "Rate must be a positive number")
      .max(100, "Rate cannot exceed 100%"),
    description: z.string().optional(),
    applyOn: z.enum(["ALL_PRODUCTS", "SPECIFIC_PRODUCTS"], {
      required_error: "Apply On is required",
    }),
  });

  type TaxFormValues = z.infer<typeof taxFormSchema>;

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      name: "",
      rate: 0,
      description: "",
      applyOn: "ALL_PRODUCTS",
    },
  });

  const applyOnValue = form.watch("applyOn");

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((current) => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  };

  const onSubmit = async (data: TaxFormValues) => {
    if (!session?.accessToken || !organizationId) return;

    try {
      const specificProductIds = data.applyOn === "SPECIFIC_PRODUCTS" ? selectedProductIds : [];

      const response = await createTax({
        name: data.name,
        rate: data.rate,
        description: data.description,
        applyOn: data.applyOn,
        specificProductIds: specificProductIds,
        accessToken: session?.accessToken!,
        organizationId: organizationId,
      });

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to create tax. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Tax created successfully.",
        });
        form.reset();
        setSelectedProductIds([]);
        mutate();
        onCancel?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tax. Please try again.",
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
              {/* Tax Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax Rate */}
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.rate")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter tax rate"
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          %
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Apply On */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="applyOn"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t("form.applyOn")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ALL_PRODUCTS" id="all_products" />
                          <FormLabel htmlFor="all_products">
                            {t("form.allProducts")}
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="SPECIFIC_PRODUCTS"
                            id="specific_products"
                          />
                          <FormLabel htmlFor="specific_products">
                            {t("form.specificProducts")}
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specific Products Select */}
            {applyOnValue === "SPECIFIC_PRODUCTS" && (
              <div className="mt-4">
                <FormLabel>{t("form.selectProducts")}</FormLabel>
                <div className="border rounded-md p-4">
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-2">
                      {products?.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`product-${product.id}`}
                            checked={selectedProductIds.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <label 
                            htmlFor={`product-${product.id}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {product.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                {selectedProductIds.length === 0 && (
                  <p className="text-sm text-destructive mt-1">
                    Please select at least one product
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter tax description (optional)"
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
            disabled={isLoading}
          >
            {t("form.cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || (applyOnValue === "SPECIFIC_PRODUCTS" && selectedProductIds.length === 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("form.saving")}
              </>
            ) : (
              t("form.save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 