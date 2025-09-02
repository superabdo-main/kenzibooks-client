
export type TermsType = 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60';

export type AddressType = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type DebitNoteItemType = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type DebitNoteType = {
  id: string;
  supplierId: string;
  supplierEmail: string;
  terms: TermsType;
  debitNoteDate: string;
  expectedShipmentDate: string;
  debitNoteAddress: AddressType;
  shippingAddress: AddressType;
  items: DebitNoteItemType[];
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