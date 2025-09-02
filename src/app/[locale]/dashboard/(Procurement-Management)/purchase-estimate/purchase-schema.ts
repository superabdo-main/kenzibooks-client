import { z } from "zod";

// Schema for address validation
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

// Schema for purchase item validation
const purchaseItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce
    .number()
    .min(1, "Quantity must be greater than 0"),
  unitPrice: z.coerce
    .number()
    .min(0.01, "Unit price must be greater than 0"),
  total: z.number().optional(),
});

// Schema for purchase form validation
export const purchaseFormSchema = z.object({
  // Supplier information
  supplierId: z.string().optional(),
  supplierEmail: z.string().email("Invalid email address"),
  terms: z.enum(["due_on_receipt", "net_15", "net_30", "net_60"] as const),
  
  // Dates
  purchaseDate: z.string().min(1, "Purchase date is required"),
  expectedShipmentDate: z.string().min(1, "Expected shipment date is required"),
  
  // Addresses
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  
  // Items
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
  
  // Summary
  subtotal: z.number().min(0),
  salesTaxRate: z.coerce
    .number()
    .min(0, "Tax rate must be non-negative")
    .max(100, "Tax rate must be 100% or less"),
  salesTax: z.number().min(0),
  discountRate: z.coerce
    .number()
    .min(0, "Discount rate must be non-negative")
    .max(100, "Discount rate must be 100% or less"),
  discount: z.number().min(0),
  grandTotal: z.number().min(0),
  
  // Additional information
  notes: z.string().optional(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]).default("pending"),
});

// Type for the purchase form data
export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

// Create empty default values for the form
export const defaultFormValues: Partial<PurchaseFormValues> = {
  supplierEmail: "",
  terms: "net_30",
  purchaseDate: new Date().toISOString().split("T")[0],
  expectedShipmentDate: new Date().toISOString().split("T")[0],
  billingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  shippingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  items: [
    {
      productName: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ],
  subtotal: 0,
  salesTaxRate: 0,
  salesTax: 0,
  discountRate: 0,
  discount: 0,
  grandTotal: 0,
  status: "pending",
  notes: "",
}; 