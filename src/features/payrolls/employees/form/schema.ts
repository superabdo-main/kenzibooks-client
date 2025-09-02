import { z } from "zod";

import {
  EmployeeStatus,
  EmployeePaymentTypeOptions,
} from "@/types/employee.type";

export const employeeStatusSchema = z.nativeEnum(EmployeeStatus);

export const employeePaymentTypeOptionsSchema = z.nativeEnum(
  EmployeePaymentTypeOptions
);

export const employeeDetailsSchema = z.object({
  employeeId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  SSN: z.string().optional(),
  status: employeeStatusSchema,
  hireDate: z.date(),
  workLocation: z.string().optional(),
  jobTitle: z.string().optional(),
  workerCompClass: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
});

export const employeePaymentMethodSchema = z.object({
  paymentDeposit: z.union([
    z.literal("DIRECT_DEPOSIT"),
    z.literal("PAPER_CHECK"),
  ]),
  directDepositMethod: z.union([
    z.literal("ONE_ACCOUNT"),
    z.literal("MULTIPLE_ACCOUNTS"),
  ]),
  accountType: z.union([z.literal("SAVING"), z.literal("CHECKING")]),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const employeePayScheduleSchema = z.object({
  payFrequency: z.string().min(1, "Pay frequency is required"),
  nextPayDate: z.date(),
  isDefault: z.boolean(),
});

export const employeePayTypeSchema = z.object({
  payType: employeePaymentTypeOptionsSchema,
  ratePerHour: z.number().min(0),
  salary: z.number().min(0),
  hourPerDay: z.number().min(0),
  dayPerWeek: z.number().min(0).max(7),
});

export const employeeCommonPayTypesSchema = z.object({
  overtimePay: z.boolean(),
  doubleOvertimePay: z.boolean(),
  holidayBonus: z.boolean(),
  bonus: z.boolean(),
  commission: z.boolean(),
});

export const employeeAdditionalPayTypesSchema = z.object({
  allowance: z.boolean(),
  reimbursement: z.boolean(),
  cashTips: z.boolean(),
  payCheckTips: z.boolean(),
  clergyHousingCash: z.boolean(),
  clergyHousingInHand: z.boolean(),
  nontaxablePerDiem: z.boolean(),
  groupTermLifeInsurance: z.boolean(),
  sCorpOwnerHealthInsurance: z.boolean(),
  companyHSAContributions: z.boolean(),
  personalUseOfCompanyCar: z.boolean(),
  bereavementPay: z.boolean(),
});

export const employeeFormSchema = z.object({
  details: employeeDetailsSchema,
  paymentMethods: employeePaymentMethodSchema,
  payTypes: employeePayTypeSchema,
  commonPayTypes: employeeCommonPayTypesSchema,
  additionalPayTypes: employeeAdditionalPayTypesSchema,
  paySchedule: employeePayScheduleSchema,
  organizationId: z.string(),
});

// Type for the employee form data
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// Create empty default values for the form
export const defaultFormValues: Partial<EmployeeFormValues> = {
  details: {
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    SSN: "",
    status: EmployeeStatus.ACTIVE,
    hireDate: new Date(),
    workLocation: "",
    jobTitle: "",
    workerCompClass: "",
    address: "",
    city: "",
    postCode: "",
    country: "",
    state: "",
  },
  paymentMethods: {
    paymentDeposit: "DIRECT_DEPOSIT",
    directDepositMethod: "ONE_ACCOUNT",
    accountType: "SAVING",
    routingNumber: "",
    accountNumber: "",
  },
  paySchedule: {
    payFrequency: "MONTHLY",
    nextPayDate: new Date(),
    isDefault: false,
  },
  payTypes: {
    dayPerWeek: 5,
    hourPerDay: 8,
    ratePerHour: 0,
    salary: 0,
    payType: EmployeePaymentTypeOptions.SALARY,
  },
  commonPayTypes: {
    overtimePay: false,
    doubleOvertimePay: false,
    holidayBonus: false,
    bonus: false,
    commission: false,
  },
  additionalPayTypes: {
    allowance: false,
    reimbursement: false,
    cashTips: false,
    payCheckTips: false,
    clergyHousingCash: false,
    clergyHousingInHand: false,
    nontaxablePerDiem: false,
    groupTermLifeInsurance: false,
    sCorpOwnerHealthInsurance: false,
    companyHSAContributions: false,
    personalUseOfCompanyCar: false,
    bereavementPay: false,
  },
  organizationId: "",
};