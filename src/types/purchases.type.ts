import { Product } from "./products.type";
import { SupplierType } from "./suppliers.type";

export type TermsType = 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30' | 'NET_60';

export type AddressType = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type PurchaseItemType = {
  productId: string;
  product: {
    id: string
    name: string;
    salePrice: number;
  }
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PurchaseType = {
  id: string;
  uuid: string;
  type: 'PURCHASE' | 'PURCHASE_ESTIMATES' | 'DEBIT_NOTE' | 'BILL';
  supplier: SupplierType;
  supplierId: string;
  paymentTerm: 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30' | 'NET_60';
  address: Address;
  addressId: string;
  shippingAddressId: string;
  items?: PurchaseItemType[];
  subTotal: number;
  salesTaxes: number;
  discount: number;
  grandTotal: number;
  paymentRemaining: number
  status: 'UNPAID' | 'PAID' | 'PARTIALLY_PAID';
  notes?: string;
  purchaseDate: Date;
  expectedShipmentDate: Date;
};

export type Address = {
  billingStreet?: String;
  billingCity?: String;
  billingState?: String;
  billingZipPostalCode?: String;
  billingCountry?: String;
  shippingStreet?: String;
  shippingCity?: String;
  shippingState?: String;
  shippingZipPostalCode?: String;
  shippingCountry?: String;
}


export const TERMS_OPTIONS = [
  { value: 'DUE_ON_RECEIPT', label: 'Due on Receipt' },
  { value: 'NET_15', label: 'Net 15' },
  { value: 'NET_30', label: 'Net 30' },
  { value: 'NET_60', label: 'Net 60' },
]; 