"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent } from "@/components/shadcn-ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import {
  SupplierFormValues,
  supplierFormSchema,
  defaultFormValues,
} from "@/app/[locale]/dashboard/(vendors)/suppliers/supplier-schema";
import { SupplierType } from "@/types/suppliers.type";
import {
  Building2,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Map,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSuppliersStore } from "@/stores/suppliers.store";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";

interface SupplierFormProps {
  defaultValues?: SupplierFormValues;
  supplierId?: string;
  isEditing?: boolean;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  defaultValues = defaultFormValues,
  supplierId,
  isEditing = false,
}) => {
  const t = useTranslations("Suppliers.form");
  const router = useRouter();
  const { createSupplier, updateSupplier, isLoading } = useSuppliersStore();
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { toast } = useToast();

  // Initialize the form with default or provided values
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: SupplierFormValues) => {
    if (!session?.accessToken || !organizationId) return;
    if (isEditing && supplierId) {
      const updatedSupplier: SupplierType = data
      updateSupplier({
        id: supplierId,
        supplier: updatedSupplier,
        organizationId,
        accessToken: session?.accessToken,
      }).then((response) => {
        if (response.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        } else {
          toast({
            variant: "default",
            title: "Success",
            description: "Supplier updated successfully",
          });
          router.push(`/dashboard/suppliers`);
        }
      });
    } else {
      // Create new supplier
      const newSupplier: SupplierType = data;
      await createSupplier({
        supplier: newSupplier,
        organizationId,
        accessToken: session?.accessToken,
      }).then((response) => {
        if (response.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        } else {
          toast({
            variant: "default",
            title: "Success",
            description: "Supplier created successfully",
          });
          router.push(`/dashboard/suppliers`);
        }
      });
    }

    // // Navigate back to suppliers list
    // router.push(`/dashboard/suppliers`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t("tabs.basic")}
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("tabs.tax")}
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              {t("tabs.address")}
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("name.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("name.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.label")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={t("contact.placeholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("contact.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email.label")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
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
                    control={form.control}
                    name="openingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("openingBalance.label")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder={t("openingBalance.placeholder")}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("openingBalance.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Information Tab */}
          <TabsContent value="tax">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="GSTNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("gstNumber.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("gstNumber.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("gstNumber.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("taxNumber.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("taxNumber.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("taxNumber.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Information Tab */}
          <TabsContent value="address">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
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
                    control={form.control}
                    name="city"
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
                    control={form.control}
                    name="state"
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
                    control={form.control}
                    name="postCode"
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
                    control={form.control}
                    name="country"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/suppliers`)}
          >
            {t("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? t("buttons.update") : t("buttons.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
