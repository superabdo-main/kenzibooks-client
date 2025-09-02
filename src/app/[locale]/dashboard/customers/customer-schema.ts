import { z } from "zod";

// Schema for supplier form validation
export const customerFormSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: z.string().optional(),
  antityCode: z.string().optional(),
  exemptionNumber: z.string().optional(),
  address: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

// Type for the supplier form data
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Create empty default values for the form
export const defaultFormValues: Partial<CustomerFormValues> = {
  name: "",
  phone: "",
  email: "",
  website: "",
  taxNumber: "",
  currency: "",
  antityCode: "",
  exemptionNumber: "",
  address: "",
  postCode: "",
  country: "",
  state: "",
  city: "",
}; 