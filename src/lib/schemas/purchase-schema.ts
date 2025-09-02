// lib/schemas/purchase-schema.ts
import { z } from "zod";

const addressSchema = z.object({
  billingStreet: z.string().min(1, "Billing street is required"),
  billingCity: z.string().min(1, "Billing city is required"),
  billingState: z.string().min(1, "Billing state is required"),
  billingZipPostalCode: z.string().min(1, "Billing zip/postal code is required"),
  billingCountry: z.string().min(1, "Billing country is required"),
  shippingStreet: z.string().min(1, "Shipping street is required"),
  shippingCity: z.string().min(1, "Shipping city is required"),
  shippingState: z.string().min(1, "Shipping state is required"),
  shippingZipPostalCode: z.string().min(1, "Shipping zip/postal code is required"),
  shippingCountry: z.string().min(1, "Shipping country is required"),
});

const itemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  total: z.number().min(0),
});

export const purchaseFormSchema = z.object({
  supplierId: z.string().optional(),
  supplier: z.object({
    email: z.string().email("Valid email is required"),
  }),
  paymentTerm: z.string().min(1, "Terms are required"),
  purchaseDate: z.string(),
  expectedShipmentDate: z.string(),
  address: addressSchema,
  items: z.array(itemSchema).optional(),
  subTotal: z.number().min(0),
  salesTaxRate: z.number().min(0).max(100),
  salesTaxes: z.number().min(0),
  discountRate: z.number().min(0).max(100),
  discount: z.number().min(0),
  grandTotal: z.number().min(0),
  notes: z.string().optional(),
});

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

export const defaultFormValues: Partial<PurchaseFormValues> = {
  supplierId: "",
  supplier: {
    email: "",
  },
  paymentTerm: "DUE_ON_RECEIPT",
  purchaseDate: new Date(Date.now()).toISOString().split("T")[0],
  expectedShipmentDate: new Date(Date.now()).toISOString().split("T")[0],
  address: {
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipPostalCode: "",
    billingCountry: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingZipPostalCode: "",
    shippingCountry: "",
  },
  items: [],
  subTotal: 0,
  salesTaxRate: 0,
  salesTaxes: 0,
  discountRate: 0,
  discount: 0,
  grandTotal: 0,
  notes: "",
};