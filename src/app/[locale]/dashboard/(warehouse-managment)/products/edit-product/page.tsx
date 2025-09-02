"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// UI Components
import { Spinner } from "@heroui/spinner";
import {
  CheckCircle,
  Save,
  ArrowLeft,
  PackageIcon,
  AlertCircle,
} from "lucide-react";
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
import { Button } from "@/components/shadcn-ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn-ui/radio-group";
import { Textarea } from "@/components/shadcn-ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Alert, AlertDescription } from "@/components/shadcn-ui/alert";

// Hooks and Stores
import { useAuth } from "@/contexts/AuthContext";
import { useProductInitials } from "@/features/products/hooks/useProductInitials";
import { useManagementStore } from "@/stores/management.store";
import { useProductsStore } from "@/stores/products.store";
import { useToast } from "@/hooks/use-toast";

// Types and Constants
type ProductType = "product" | "service";
type TaxType = "taxable" | "non_taxable";

interface Product {
  id: string;
  type: ProductType;
  name: string;
  sku?: string;
  barcode?: string;
  taxType: TaxType;
  taxCode?: string;
  quantity?: number;
  warehouseId: string;
  categoryId: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  type: ProductType;
  name: string;
  sku?: string;
  barcode?: string;
  taxType: TaxType;
  taxCode?: string;
  quantity?: number;
  warehouseId: string;
  categoryId: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
}

// Form validation schema
const formSchema = z.object({
  type: z.enum(["product", "service"]),
  name: z.string().min(1, { message: "Name is required" }),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  taxType: z.enum(["taxable", "non_taxable"]),
  taxCode: z.string().optional(),
  quantity: z.coerce.number().optional(),
  warehouseId: z
    .string()
    .min(1, { message: "Warehouse is required" })
    .optional(),
  categoryId: z.string().min(1, { message: "Category is required" }).optional(),
  description: z.string().optional(),
  purchasePrice: z.coerce
    .number()
    .min(0, { message: "Price must be at least 0" }),
  salePrice: z.coerce.number().min(0, { message: "Price must be at least 0" }),
});


const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const productId = params.get("id");
  const t = useTranslations("NewProduct");
  const { toast } = useToast();

  // Store hooks
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const {
    categories,
    warehouses,
    isLoading: isLoadingInitials,
    isError: isInitialsError,
  } = useProductInitials();
  const {
    updateProduct,
    getProductById,
    error,
    isLoading: isUpdatingProduct,
  } = useProductsStore();

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "product",
      name: "",
      sku: "",
      barcode: "",
      taxType: "taxable",
      taxCode: "",
      quantity: 0,
      warehouseId: "",
      categoryId: "",
      description: "",
      purchasePrice: 0,
      salePrice: 0,
    },
  });

  const productType = form.watch("type");
  const taxType = form.watch("taxType");

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || !session?.accessToken || !organizationId) return;

      try {
        setIsLoadingProduct(true);
        const response = await getProductById({
          productId,
          accessToken: session.accessToken,
          organizationId,
        });

        if (response.error) {
          toast({
            title: "Error",
            description: "Failed to load product data",
            variant: "destructive",
          });
          return;
        }
        if (response.data) {
          setProduct(response.data);
          // Reset form with product data
          form.reset({
            type: response.data.type.toLowerCase() as ProductType,
            name: response.data.name,
            sku: response.data.sku || "",
            barcode: response.data.barcode || "",
            taxType: response.data.taxType.toLowerCase() as TaxType,
            taxCode: response.data.taxCode || "",
            quantity: response.data.quantity || 0,
            warehouseId: response.data.warehouseId,
            categoryId: response.data.categoryId,
            description: response.data.description || "",
            purchasePrice: response.data.purchasePrice,
            salePrice: response.data.salePrice,
          });
        } else {
          setProductError("Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setProductError("Failed to load product");
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [
    productId,
    session?.accessToken,
    organizationId,
    getProductById,
    form,
    toast,
  ]);

  // Effects
  useEffect(() => {
    if (isInitialsError || error) {
      toast({
        title: "Error",
        description: "Error while loading data",
        variant: "destructive",
      });
    }
  }, [isInitialsError, error, toast]);

  // Handlers
  const handleBack = () => {
    router.push("/dashboard/products");
  };

  const onSubmit = async (values: FormData) => {
    if (!session?.accessToken || !organizationId || !productId) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        ...values,
        type: values.type.toUpperCase(),
        taxType: values.taxType.toUpperCase(),
        id: productId,
      };

      await updateProduct({
        product: data,
        accessToken: session.accessToken,
        organizationId,
      });

      setFormSubmitted(true);
      toast({
        title: "Success",
        description: `${productType === "product" ? "Product" : "Service"} updated successfully`,
      });

      // // Navigate after a brief delay to show success message
      // setTimeout(() => {
      //   router.push("/dashboard/products");
      // }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while updating the product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isUpdatingProduct;

  // Loading state
  if (isLoadingProduct || isLoadingInitials) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-muted-foreground">Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productError) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{productError}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent border-l-4 border-blue-500 pl-2 flex gap-4 justify-start items-center">
            <span className="text-blue-500">
              <PackageIcon />
            </span>
            {t(`title.${productType}`, { name: product?.name })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(`subtitle.${productType}`)}
          </p>
          {product?.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 transition-all hover:gap-3"
          onClick={handleBack}
          type="button"
        >
          <ArrowLeft size={16} />
          <span>{t("back")}</span>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Product Type Section */}
            <ProductTypeSection
              form={form}
              t={t}
              variants={CARD_VARIANTS}
              isEditing={true}
            />

            {/* General Information */}
            <GeneralInfoSection
              form={form}
              t={t}
              variants={CARD_VARIANTS}
              categories={categories}
              isLoadingInitials={isLoadingInitials}
              productType={productType}
            />

            {/* Inventory Information */}
            <InventorySection
              form={form}
              t={t}
              variants={CARD_VARIANTS}
              warehouses={warehouses}
              isLoadingInitials={isLoadingInitials}
              isEditing={true}
            />

            {/* Tax Information */}
            <TaxInfoSection
              form={form}
              t={t}
              variants={CARD_VARIANTS}
              taxType={taxType}
              productType={productType}
            />

            {/* Pricing */}
            <PricingSection
              form={form}
              t={t}
              variants={CARD_VARIANTS}
              productType={productType}
            />
          </div>

          {/* Submit Section */}
          <SubmitSection
            t={t}
            isLoading={isLoading}
            formSubmitted={formSubmitted}
            productType={productType}
            onCancel={handleBack}
            isEditing={true}
          />
        </form>
      </Form>
    </div>
  );
};

// Component Sections (reused from NewProductPage with modifications)
const ProductTypeSection: React.FC<{
  form: any;
  t: any;
  variants: any;
  isEditing?: boolean;
}> = ({ form, t, variants, isEditing = false }) => (
  <motion.div initial="hidden" animate="visible" variants={variants}>
    <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t("sections.productType.title")}</CardTitle>
        <CardDescription>
          {t("sections.productType.description")}
          {isEditing && (
            <span className="block mt-1 text-xs text-amber-600">
              Note: Changing product type may affect inventory tracking
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-8"
                >
                  {["product", "service"].map((type) => (
                    <div
                      key={type}
                      className="flex items-center space-x-2 bg-background border rounded-lg px-4 py-3 hover:bg-accent/20 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={type} id={type} />
                      <FormLabel
                        htmlFor={type}
                        className="cursor-pointer font-medium"
                      >
                        {t(`fields.productType.${type}`)}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  </motion.div>
);

const GeneralInfoSection: React.FC<{
  form: any;
  t: any;
  variants: any;
  categories: any[];
  isLoadingInitials: boolean;
  productType: string;
}> = ({ form, t, variants, categories, isLoadingInitials, productType }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants}
    transition={{ delay: 0.1 }}
  >
    <Card className="overflow-hidden border-l-4 border-l-blue-500/70 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t("sections.generalInfo.title")}</CardTitle>
        <CardDescription>
          {t
            .raw("sections.generalInfo.description")
            .replace("{productType}", t(`fields.productType.${productType}`))}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("fields.name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.name")}
                    {...field}
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("fields.category")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingInitials}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all focus-within:ring-2 focus-within:ring-primary/30">
                      <SelectValue
                        placeholder={t("placeholders.selectCategory")}
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

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{t("fields.sku")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.sku")}
                    {...field}
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("fields.barcode")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.barcode")}
                    {...field}
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-medium">
                  {t("fields.description")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("placeholders.description")}
                    className="resize-none h-24 transition-all focus-within:ring-2 focus-within:ring-primary/30"
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
  </motion.div>
);

const InventorySection: React.FC<{
  form: any;
  t: any;
  variants: any;
  warehouses: any[];
  isLoadingInitials: boolean;
  isEditing?: boolean;
}> = ({
  form,
  t,
  variants,
  warehouses,
  isLoadingInitials,
  isEditing = false,
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants}
    transition={{ delay: 0.2 }}
  >
    <Card className="overflow-hidden border-l-4 border-l-blue-500/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t("sections.inventory.title")}</CardTitle>
        <CardDescription>
          {t("sections.inventory.description")}
          {isEditing && (
            <span className="block mt-1 text-xs text-amber-600">
              Note: Changing quantity will create an inventory adjustment
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {isEditing && t("fields.initialQuantity.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/30"
                  />
                </FormControl>
                <FormDescription>
                  {isEditing && t("fields.initialQuantity.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warehouseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("fields.warehouse")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingInitials}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all focus-within:ring-2 focus-within:ring-primary/30">
                      <SelectValue
                        placeholder={t("placeholders.selectWarehouse")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TaxInfoSection: React.FC<{
  form: any;
  t: any;
  variants: any;
  taxType: string;
  productType: string;
}> = ({ form, t, variants, taxType, productType }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants}
    transition={{ delay: 0.3 }}
  >
    <Card className="overflow-hidden border-l-4 border-l-blue-500/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t("sections.taxInfo.title")}</CardTitle>
        <CardDescription>
          {t
            .raw("sections.taxInfo.description")
            .replace("{productType}", t(`fields.productType.${productType}`))}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="font-medium">
                  {t("fields.taxType.label")}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-3"
                  >
                    {["taxable", "non_taxable"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center space-x-2 bg-background border rounded-lg px-4 py-3 hover:bg-accent/20 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={type} id={type} />
                        <FormLabel
                          htmlFor={type}
                          className="cursor-pointer font-medium"
                        >
                          {t(
                            `fields.taxType.${type === "taxable" ? "taxable" : "nonTaxable"}`
                          )}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {taxType === "taxable" && (
            <FormField
              control={form.control}
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("fields.taxCode")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="transition-all focus-within:ring-2 focus-within:ring-primary/30"
                    />
                  </FormControl>
                  {/* <FormDescription>
                            {t("fields.taxCode.description")}
                          </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const PricingSection: React.FC<{
  form: any;
  t: any;
  variants: any;
  productType: string;
}> = ({ form, t, variants, productType }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants}
    transition={{ delay: 0.4 }}
  >
    <Card className="overflow-hidden border-l-4 border-l-blue-500/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t("sections.pricing.title")}</CardTitle>
        <CardDescription>
          {t
            .raw("sections.pricing.description")
            .replace("{productType}", t(`fields.productType.${productType}`))}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {["purchasePrice", "salePrice"].map((priceType) => (
            <FormField
              key={priceType}
              control={form.control}
              name={priceType as "purchasePrice" | "salePrice"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t(
                      `fields.${priceType === "salePrice" ? "salesPrice" : priceType}`
                    )}
                  </FormLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-7 transition-all focus-within:ring-2 focus-within:ring-primary/30"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const SubmitSection: React.FC<{
  t: any;
  isLoading: boolean;
  formSubmitted: boolean;
  productType: string;
  onCancel: () => void;
  isEditing?: boolean;
}> = ({
  t,
  isLoading,
  formSubmitted,
  productType,
  onCancel,
  isEditing = false,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="flex justify-end space-x-4 sticky bottom-4 z-10"
  >
    <div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border flex items-center gap-4">
      {formSubmitted && (
        <div className="flex items-center text-green-500 gap-1 animate-fadeIn">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">
            {isEditing && t("notifications.success")}
          </span>
        </div>
      )}
      <Button variant="outline" type="button" onClick={onCancel}>
        {t("buttons.cancel")}
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="min-w-[120px] relative overflow-hidden group"
      >
        {isLoading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <span className="flex items-center gap-2">
            <Save
              size={16}
              className="transition-transform group-hover:rotate-12 duration-300"
            />
            {isEditing
              ? t
                  .raw("buttons.save")
                  .replace(
                    "{productType}",
                    t(`fields.productType.${productType}`)
                  )
              : t
                  .raw("buttons.save")
                  .replace(
                    "{productType}",
                    t(`fields.productType.${productType}`)
                  )}
          </span>
        )}
      </Button>
    </div>
  </motion.div>
);

export default EditProductPage;
