// Main exports
export { default as EmployeeForm } from "./form";
export { EmployeeDetailsTab } from "./employee-details-tab";
export { EmployeePaymentTab } from "./employee-payment-tab";
export { EmployeePayTypeTab } from "./employee-paytype-tab";
export { EmployeePayTypesTab } from "./employee-additionaltypes-tab";

// Schema and types
export {
  employeeFormSchema,
  employeeDetailsSchema,
  employeePaymentMethodSchema,
  employeePayScheduleSchema,
  employeePayTypeSchema,
  employeeCommonPayTypesSchema,
  employeeAdditionalPayTypesSchema,
  defaultFormValues,
  type EmployeeFormValues,
} from "./schema";

// Re-export types for convenience
export type {
  EmployeeStatus,
  EmployeePayFrequency,
  EmployeePaymentTypeOptions,
  Employee,
} from "@/types/employee.type";