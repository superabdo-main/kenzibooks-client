// Tax data type
export type Tax = {
  id: string;
  name: string;
  rate: number;
  description?: string;
  applyOn: "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS";
  specificProductIds?: string[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}; 