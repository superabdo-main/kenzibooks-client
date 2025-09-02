// components/purchase-form/ItemsSection.tsx
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Badge } from "@/components/shadcn-ui/badge";
import { Trash2, Plus } from "lucide-react";
import { SaleFormValues } from "@/lib/schemas/sale-schema";
import { Product } from "@/types/products.type";

interface ItemsSectionProps {
  form: UseFormReturn<SaleFormValues>;
  products: Product[];
  onItemChange: (index: number) => void;
  t: (key: string) => string;
}

export const ItemsSection = ({ form, products, onItemChange, t }: ItemsSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      form.setValue(`items.${index}.productId`, selectedProduct.id);
      form.setValue(`items.${index}.unitPrice`, selectedProduct.salePrice);
      onItemChange(index);
    }
  };

  const addItem = () => {
    append({
      productId: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newSale.sections.items")}</CardTitle>
        <CardDescription>
          {t("newSale.sections.itemsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>{t("newSale.fields.product")}</FormLabel>
                <FormControl>
                  <Autocomplete
                    allowsCustomValue
                    selectedKey={form.getValues(`items.${index}.productId`)}
                    onSelectionChange={(value) => handleProductSelect(value as string, index)}
                    variant="bordered"
                    defaultItems={products.map((product) => ({
                      value: product.id,
                      label: product.name,
                    }))}
                  >
                    {(item) => {
                      const product = products.find((p) => p.id === item.value);
                      return (
                        <AutocompleteItem key={item.value} textValue={item.label}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{item.label}</span>
                              {product && (
                                <span className="text-sm text-muted-foreground">
                                  SKU: {product.sku} | Price: ${product.salePrice}
                                </span>
                              )}
                            </div>
                            {product && product.quantity <= 5 && (
                              <Badge variant="destructive" className="ml-2">
                                Low Stock: {product.quantity}
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

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newSale.fields.quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          onItemChange(index);
                        }}
                      />
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
                    <FormLabel>{t("newSale.fields.unitPrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          onItemChange(index);
                        }}
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
                    <FormLabel>{t("newSale.fields.total")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled
                        value={field.value?.toFixed(2) || "0.00"}
                        className="bg-muted"
                      />
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
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          {t("newSale.actions.addItem")}
        </Button>
      </CardContent>
    </Card>
  );
};