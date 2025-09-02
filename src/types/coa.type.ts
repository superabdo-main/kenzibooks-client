export interface ChartOfAccount {
  id: string;
  accountType: string;
  accountDetail: string;
  accountName: string;
  description?: string;
  balance: number;
  payOf?: string | Date;
  organizationId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
} 