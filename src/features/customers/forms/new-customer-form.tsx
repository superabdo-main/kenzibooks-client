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
import { CustomerType } from "@/types/customers";
import {
  Building2,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Map,
  Loader2,
  Globe,
  Currency,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";
import { useCustomersStore } from "@/stores/customers.store";
import {
  customerFormSchema,
  CustomerFormValues,
  defaultFormValues,
} from "@/app/[locale]/dashboard/customers/customer-schema";

interface CustomerFormProps {
  defaultValues?: CustomerFormValues;
  customerId?: string;
  isEditing?: boolean;
}

export const NewCustomerForm: React.FC<CustomerFormProps> = ({
  defaultValues = defaultFormValues,
  customerId,
  isEditing = false,
}) => {
  const t = useTranslations("Customers.form");
  const router = useRouter();
  const { createCustomer, updateCustomer, isLoading } = useCustomersStore();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { toast } = useToast();

  // Initialize the form with default or provided values
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues) => {
    if (!session?.accessToken || !organizationId) return;
    if (isEditing && customerId) {
      const updatedCustomer: CustomerType = data;
      updateCustomer({
        id: customerId,
        customer: updatedCustomer,
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
            description: "Customer updated successfully",
          });
          router.push(`/dashboard/customers`);
        }
      });
    } else {
      // Create new supplier
      const newCustomer: CustomerType = data;
      await createCustomer({
        customer: newCustomer,
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
            description: "Customer created successfully",
          });
          router.push(`/dashboard/customers`);
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
                    name="phone"
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
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("website.label")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={t("website.placeholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("website.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currency.label")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={t("currency.placeholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("currency.description")}
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
                    name="antityCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("antityCode.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("antityCode.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("antityCode.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exemptionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("exemptionNumber.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("exemptionNumber.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("exemptionNumber.description")}
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
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditing ? (
              t("buttons.update")
            ) : (
              t("buttons.create")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewCustomerForm;
