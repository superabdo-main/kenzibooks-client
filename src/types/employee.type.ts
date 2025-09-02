export enum EmployeeStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
  }
  
  export enum EmployeePaymentTypeOptions {
    HOURLY = 'HOURLY',
    SALARY = 'SALARY',
    COMMISSION_ONLY = 'COMMISSION_ONLY',
  }
  
  // types.ts
  export interface Employee {
    id: string;
    payScheduleId: string;
    paySchedule: EmployeePaySchedule;
    details: EmployeeDetails;
    paymentMethods: EmployeePaymentMethod;
    payTypes: EmployeePayType;
    commonPayTypes: EmployeeCommonPayTypes;
    additionalPayTypes: EmployeeAdditionalPayTypes;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface EmployeeDetails {
    id: string;
    employeeId?: string;
    name: string;
    email: string;
    phone?: string;
    SSN?: string;
    status: EmployeeStatus;
    hireDate: Date;
    workLocation?: string;
    jobTitle?: string;
    workerCompClass?: string;
    address?: string;
    city?: string;
    postCode?: string;
    country?: string;
    state?: string;
  }
  
  export interface EmployeePaymentMethod {
    id: string;
    paymentDeposit: 'DIRECT_DEPOSIT' | 'PAPER_CHECK';
    directDepositMethod: 'ONE_ACCOUNT' | 'MULTIPLE_ACCOUNTS';
    accountType: 'SAVING' | 'CHECKING';
    routingNumber?: string;
    accountNumber?: string;
  }
  
  export interface EmployeePaySchedule {
    id: string;
    payFrequency: string;
    nextPayDate: Date;
    isDefault: boolean;
    taxes: number;
    organizationId?: string;
    _count?: {
      employee: number
    }
  }
  
  export interface EmployeePayType {
    id: string;
    payType: EmployeePaymentTypeOptions;
    ratePerHour: number;
    salary: number;
    hourPerDay: number;
    dayPerWeek: number;
  }
  
  export interface EmployeeCommonPayTypes {
    id: string;
    overtimePay: boolean;
    doubleOvertimePay: boolean;
    holidayBonus: boolean;
    bonus: boolean;
    commission: boolean;
  }
  
  export interface EmployeeAdditionalPayTypes {
    id: string;
    allowance: boolean;
    reimbursement: boolean;
    cashTips: boolean;
    payCheckTips: boolean;
    clergyHousingCash: boolean;
    clergyHousingInHand: boolean;
    nontaxablePerDiem: boolean;
    groupTermLifeInsurance: boolean;
    sCorpOwnerHealthInsurance: boolean;
    companyHSAContributions: boolean;
    personalUseOfCompanyCar: boolean;
    bereavementPay: boolean;
  }