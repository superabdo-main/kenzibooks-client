import { z } from "zod";

// Schema for supplier form validation
export const supplierFormSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contact: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  GSTNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  openingBalance: z.coerce
    .number()
    .min(0, "Opening balance must be a non-negative number"),
  address: z.string().min(1, "Address is required"),
  postCode: z.string().min(1, "Post code is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

// Type for the supplier form data
export type SupplierFormValues = z.infer<typeof supplierFormSchema>;

// Create empty default values for the form
export const defaultFormValues: Partial<SupplierFormValues> = {
  name: "",
  contact: "",
  email: "",
  GSTNumber: "",
  taxNumber: "",
  openingBalance: 0,
  address: "",
  postCode: "",
  country: "",
  state: "",
  city: "",
}; 