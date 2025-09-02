// Product data type
export type Product = {
  id: string;
  type: "PRODUCT" | "SERVICE";
  uuid: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  taxType: "NON_TAXABLE" | "TAXABLE";
  taxCode: string;
  quantity: number;
  warehouse: Warehouse;
  organizationId: string;
};

export type Warehouse = {
  id: string;
  name: string;
  products: Product[];
};
