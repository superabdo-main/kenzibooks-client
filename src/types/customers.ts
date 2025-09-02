export type CustomerType = {
  id: string
  name: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  currency: string;
  antityCode: string;
  exemptionNumber: string;
  address: string;
  postCode: string;
  country: string;
  state: string;
  city: string;
  depositHistory: DepositType[];
  organizationId: string;
};


export type DepositType = {
  id: string
  paymentDate: Date;
  paidBy: string;
  amount: number;
  note: string;
}