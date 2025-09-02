
export type TermsType = 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60';

export type AddressType = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type BillItemType = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type BillType = {
  id: string;
  supplierId: string;
  supplierEmail: string;
  terms: TermsType;
  billDate: string;
  expectedShipmentDate: string;
  billingAddress: AddressType;
  shippingAddress: AddressType;
  items: BillItemType[];
  subtotal: number;
  salesTax: number;
  discount: number;
  grandTotal: number;
  notes?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
  createdAt: string;
  updatedAt: string;
};

export const TERMS_OPTIONS = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_15', label: 'Net 15' },
  { value: 'net_30', label: 'Net 30' },
  { value: 'net_60', label: 'Net 60' },
]; 