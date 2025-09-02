"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { useProductsStore } from "@/stores/products.store";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Resolver } from "react-hook-form";

import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Textarea } from "@/components/shadcn-ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Separator } from "@/components/shadcn-ui/separator";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/shadcn-ui/badge";
import { Product } from "@/types/products.type";
import { debitNoteFormSchema, DebitNoteFormValues, defaultFormValues } from "@/app/[locale]/dashboard/(Procurement-Management)/debit-notes/debit-note-schema";
import { DebitNoteType, TERMS_OPTIONS } from "@/types/debit-note.type";

interface ProductOption {
  value: string;
  label: string;
  disabled: boolean;
}

interface DebitNoteFormProps {
  debitNote?: DebitNoteType;
  isEdit?: boolean;
  onSubmit: (data: DebitNoteType) => void;
  onCancel: () => void;
}

export const DebitNoteForm = ({
  debitNote,
  isEdit = false,
  onSubmit,
  onCancel,
}: DebitNoteFormProps) => {
  const t = useTranslations("DebitNotes");
  const { products, fetchProducts } = useProductsStore();

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Initialize form with default values or existing purchase data
  const form = useForm<DebitNoteFormValues>({
    resolver: zodResolver(debitNoteFormSchema) as Resolver<DebitNoteFormValues>,
    defaultValues: debitNote
      ? {
          ...debitNote,
          salesTaxRate: calculateTaxRate(debitNote.subtotal, debitNote.salesTax),
          discountRate: calculateDiscountRate(debitNote.subtotal, debitNote.discount),
          status: debitNote.status || "pending",
          terms: debitNote.terms || "net_30",
          items: debitNote.items.map(item => ({
            productId: item.productId || "",
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total || 0,
          })),
        }
      : defaultFormValues as DebitNoteFormValues
  });

  // Set up field array for dynamic items
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // State for shipping address same as Debit Note checkbox
  const [useShippingAsDebitNote, setUseShippingAsDebitNote] = useState(false);

  // Add debounced search for products
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  // Add loading states
  const [isCalculating, setIsCalculating] = useState(false);

  // Function to calculate tax rate from amount
  function calculateTaxRate(subtotal: number, taxAmount: number): number {
    return subtotal > 0 ? Math.round((taxAmount / subtotal) * 100) : 0;
  }

  // Function to calculate discount rate from amount
  function calculateDiscountRate(subtotal: number, discountAmount: number): number {
    return subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;
  }

  // Watch form values for calculations
  const watchItems = form.watch("items");
  const watchSalesTaxRate = form.watch("salesTaxRate") || 0;
  const watchDiscountRate = form.watch("discountRate") || 0;
  const debitNoteAddress = form.watch("debitNoteAddress");

  // Calculate and update item total when quantity or unit price changes
  const updateItemTotal = (index: number) => {
    const item = watchItems[index];
    if (!item) return;

    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const total = quantity * unitPrice;

    form.setValue(`items.${index}.total`, Number(total.toFixed(2)), {
      shouldValidate: true,
    });

    // Trigger recalculation of all totals
    calculateTotals();
  };

  // Calculate all totals (subtotal, tax, discount, grand total)
  const calculateTotals = () => {
    // Calculate subtotal from all items
    const subtotal = watchItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    // Calculate tax and discount amounts
    const taxAmount = (subtotal * (Number(watchSalesTaxRate) || 0)) / 100;
    const discountAmount = (subtotal * (Number(watchDiscountRate) || 0)) / 100;

    // Calculate grand total
    const grandTotal = subtotal + taxAmount - discountAmount;

    // Update all totals in form
    form.setValue("subtotal", Number(subtotal.toFixed(2)), { shouldValidate: true });
    form.setValue("salesTax", Number(taxAmount.toFixed(2)), { shouldValidate: true });
    form.setValue("discount", Number(discountAmount.toFixed(2)), { shouldValidate: true });
    form.setValue("grandTotal", Number(grandTotal.toFixed(2)), { shouldValidate: true });
  };

  // Watch for changes in items array
  useEffect(() => {
    watchItems.forEach((_, index) => {
      updateItemTotal(index);
    });
  }, [watchItems]);

  // Watch for changes in tax or discount rates
  useEffect(() => {
    calculateTotals();
  }, [watchSalesTaxRate, watchDiscountRate]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    form.setValue(`items.${index}.quantity`, value, { shouldValidate: true });
    updateItemTotal(index);
  };

  // Handle unit price change
  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    form.setValue(`items.${index}.unitPrice`, value, { shouldValidate: true });
    updateItemTotal(index);
  };

  // Copy billing address to shipping address when checkbox is checked
  useEffect(() => {
    if (useShippingAsDebitNote) {
      form.setValue("shippingAddress", debitNoteAddress);
    }
  }, [useShippingAsDebitNote, debitNoteAddress, form]);

  // Function to add a new empty item
  const addItem = () => {
    append({
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    });
  };

  // Product selection handler with proper typing
  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      form.setValue(`items.${index}.productId`, selectedProduct.id);
      form.setValue(`items.${index}.productName`, selectedProduct.name);
      form.setValue(`items.${index}.unitPrice`, selectedProduct.purchasePrice);
      
      // Recalculate total for this item
      const quantity = form.getValues(`items.${index}.quantity`) || 1;
      form.setValue(`items.${index}.total`, quantity * selectedProduct.purchasePrice);
    }
    updateItemTotal(index);
  };

  // Render product selection with Autocomplete
  const renderProductSelection = (index: number) => {
    const currentValue = form.getValues(`items.${index}`);
    
    return (
      <FormItem>
        <FormLabel>{t("newDebitNote.fields.product")}</FormLabel>
        <FormControl>
          <Autocomplete
            allowsCustomValue
            selectedKey={currentValue.productId}
            onSelectionChange={(value) => handleProductSelect(value as string, index)}
            variant="bordered"
            defaultItems={products.map((product: Product) => ({
              value: product.id,
              label: product.name,
              disabled: product.warehouses.some((warehouse) => warehouse.quantity <= 0),
            }))}
          >
            {(item) => {
              const product: Product = products.find((p) => p.id === item.value);
              return (
                <AutocompleteItem key={item.value} textValue={item.label}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      {product && (
                        <span className="text-sm text-muted-foreground">
                          SKU: {product.sku} | Price: ${product.purchasePrice}
                        </span>
                      )}
                    </div>
                    {product && product.warehouses.some((warehouse) => warehouse.quantity <= 5) && (
                      <Badge variant="destructive" className="ml-2">
                        Low Stock: {product.warehouses.find((warehouse) => warehouse.quantity <= 5)?.quantity}
                      </Badge>
                    )}
                  </div>
                </AutocompleteItem>
              );
            }}
          </Autocomplete>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };

  // Handle form submission
  const handleSubmit: SubmitHandler<DebitNoteFormValues> = async (data) => {
    const debitNoteData: DebitNoteType = {
      id: debitNote?.id || uuidv4(),
      supplierId: data.supplierId || uuidv4(),
      supplierEmail: data.supplierEmail,
      terms: data.terms,
      debitNoteDate: data.debitNoteDate,
      expectedShipmentDate: data.expectedShipmentDate,
      debitNoteAddress: data.debitNoteAddress,
      shippingAddress: data.shippingAddress,
      items: data.items.map(item => ({
        ...item,
        productId: item.productId || uuidv4(),
        total: (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
      })),
      subtotal: data.subtotal,
      salesTax: data.salesTax,
      discount: data.discount,
      grandTotal: data.grandTotal,
      notes: data.notes,
      status: data.status,
      createdAt: debitNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(debitNoteData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Supplier Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.supplierInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="supplierEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newDebitNote.fields.supplierEmail")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("newDebitNote.placeholders.supplierEmail")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newDebitNote.fields.terms")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("newDebitNote.placeholders.selectTerms")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TERMS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.dates")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="debitNoteDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newDebitNote.fields.debitNoteDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedShipmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newDebitNote.fields.expectedShipmentDate")}</FormLabel>
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

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.addresses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Debit Note Address */}
            <div>
              <h3 className="text-lg font-medium mb-4">{t("newDebitNote.fields.debitNoteAddress")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="debitNoteAddress.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.debitNoteStreet")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.debitNoteStreet")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debitNoteAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.debitNoteCity")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.debitNoteCity")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debitNoteAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.debitNoteState")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.debitNoteState")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debitNoteAddress.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.debitNoteZip")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.debitNoteZip")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debitNoteAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.debitNoteCountry")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.debitNoteCountry")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="copy-debitNote"
                checked={useShippingAsDebitNote}
                onCheckedChange={(checked) => setUseShippingAsDebitNote(!!checked)}
              />
              <label
                htmlFor="copy-debitNote"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {t("newDebitNote.fields.copyDebitNoteAddress")}
              </label>
            </div>

            <Separator className="my-4" />

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-medium mb-4">{t("newDebitNote.fields.shippingAddress")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shippingAddress.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.shippingStreet")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.shippingStreet")}
                          disabled={useShippingAsDebitNote}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.shippingCity")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.shippingCity")}
                          disabled={useShippingAsDebitNote}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.shippingState")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.shippingState")}
                          disabled={useShippingAsDebitNote}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.shippingZip")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.shippingZip")}
                          disabled={useShippingAsDebitNote}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newDebitNote.fields.shippingCountry")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newDebitNote.placeholders.shippingCountry")}
                          disabled={useShippingAsDebitNote}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Items */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.items")}</CardTitle>
            <CardDescription>{t("newDebitNote.sections.itemsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderProductSelection(index)}

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.quantity")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => handleQuantityChange(e, index)}
                              className={cn(
                                isCalculating && "opacity-50"
                              )}
                              disabled={isCalculating}
                            />
                            {isCalculating && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.unitPrice")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => handleUnitPriceChange(e, index)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.total`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.total")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              {t("newDebitNote.actions.addItem")}
            </Button>
          </CardContent>
        </Card>

        {/* Purchase Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="subtotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.subtotal")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            value={field.value?.toFixed(2) || "0.00"}
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="salesTaxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.salesTax")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="salesTax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.salesTaxAmount")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            value={field.value?.toFixed(2) || "0.00"}
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="discountRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.discount")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newDebitNote.fields.discountAmount")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            value={field.value?.toFixed(2) || "0.00"}
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="grandTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">{t("newDebitNote.fields.grandTotal")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            value={field.value?.toFixed(2) || "0.00"}
                            className="bg-muted font-bold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newDebitNote.sections.additionalInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newDebitNote.fields.notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("newDebitNote.placeholders.notes")}
                        rows={4}
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('newDebitNote.buttons.cancel')}
          </Button>
          <Button type="submit">
            {isEdit ? t('editDebitNote.buttons.save') : t('newDebitNote.buttons.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 