"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { useEmployees } from "@/features/payrolls/employees/hooks/useEmployees";
import { usePayrollsEmployees } from "@/features/payrolls/hooks/usePayrollEmployees";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useManagementStore } from "@/stores/management.store";

// Updated types based on your API structure
export enum EmployeeStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
}

export enum EmployeePaymentTypeOptions {
  HOURLY = "HOURLY",
  SALARY = "SALARY",
  COMMISSION_ONLY = "COMMISSION_ONLY",
}

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
  paymentDeposit: "DIRECT_DEPOSIT" | "PAPER_CHECK";
  directDepositMethod: "ONE_ACCOUNT" | "MULTIPLE_ACCOUNTS";
  accountType: "SAVING" | "CHECKING";
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
    employee: number;
  };
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

// Payroll-specific employee data structure
export interface PayrollEmployee {
  id: string;
  taxes: number;
  name: string;
  baseSalary: number;
  regularPay: number;
  overtime: number;
  sickPay: number;
  vacationPay: number;
  taxableOffset: number;
  totalHrs: number;
  grossPay: number;
  payType: EmployeePaymentTypeOptions;
  ratePerHour: number;
  hourPerDay: number;
  dayPerWeek: number;
  createdAt: Date;
  isEditing?: boolean;
}

interface PayrollField {
  key: keyof PayrollEmployee;
  label: string;
  type: "text" | "number" | "select";
  editable: boolean;
}

interface PayrollTotals {
  baseSalary: number;
  regularPay: number;
  overtime: number;
  sickPay: number;
  vacationPay: number;
  taxableOffset: number;
  totalHrs: number;
  grossPay: number;
}

interface PayrollManagementProps {
  payrollId?: string; // Optional payroll ID to fetch specific payroll employees
}

const PayrollManagement: React.FC<PayrollManagementProps> = ({ payrollId }) => {
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const [payPeriod, setPayPeriod] = useState<string>(
    "2025-07-07 to 2025-07-21"
  );
  const [payDate, setPayDate] = useState<string>("07/31/2025");
  const [payrollEmployees, setPayrollEmployees] = useState<PayrollEmployee[]>(
    []
  );
  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
  const [editingEmployeeIds, setEditingEmployeeIds] = useState<Set<string>>(
    new Set()
  );
  const [originalEmployeeData, setOriginalEmployeeData] = useState<
    Map<string, PayrollEmployee>
  >(new Map());
  const payRollId = useSearchParams().get("id");
  const {
    employees: availableEmployees,
    isLoading,
    mutate,
    isError,
  } = usePayrollsEmployees({ id: payRollId! });
  const [totals, setTotals] = useState<PayrollTotals>({
    baseSalary: 0,
    regularPay: 0,
    overtime: 0,
    sickPay: 0,
    vacationPay: 0,
    taxableOffset: 0,
    totalHrs: 0,
    grossPay: 0,
  });

  const defaultFields: PayrollField[] = [
    { key: "name", label: "Name", type: "text", editable: false },
    {
      key: "baseSalary",
      label: "Base Salary",
      type: "number",
      editable: false,
    },
    {
      key: "regularPay",
      label: "Regular Pay",
      type: "number",
      editable: false,
    },
    { key: "overtime", label: "Overtime", type: "number", editable: true },
    { key: "sickPay", label: "Sick Pay", type: "number", editable: true },
    {
      key: "vacationPay",
      label: "Vacation Pay",
      type: "number",
      editable: true,
    },
    {
      key: "taxableOffset",
      label: "Taxable Offset",
      type: "number",
      editable: true,
    },
    { key: "totalHrs", label: "Total Hrs", type: "number", editable: true },
    { key: "grossPay", label: "Gross Pay", type: "number", editable: false },
  ];

  const [fields] = useState<PayrollField[]>(defaultFields);

  const [newEmployee, setNewEmployee] = useState<PayrollEmployee>({
    id: "",
    taxes: 0,
    name: "",
    baseSalary: 0,
    regularPay: 0,
    overtime: 0,
    sickPay: 0,
    vacationPay: 0,
    taxableOffset: 0,
    totalHrs: 0,
    grossPay: 0,
    payType: EmployeePaymentTypeOptions.HOURLY,
    ratePerHour: 0,
    hourPerDay: 8,
    dayPerWeek: 5,
    createdAt: new Date(),
  });

  // Auto-calculate regular pay based on pay type
  const calculateRegularPay = (employee: PayrollEmployee): number => {
    if (employee.payType === EmployeePaymentTypeOptions.SALARY) {
      return employee.baseSalary;
    } else if (employee.payType === EmployeePaymentTypeOptions.HOURLY) {
      return employee.totalHrs * employee.ratePerHour;
    }
    return 0;
  };

  // Auto-calculate gross pay
  const calculateGrossPay = (employee: PayrollEmployee): number => {
    return (
      employee.regularPay +
      employee.overtime +
      employee.sickPay +
      employee.vacationPay +
      employee.taxableOffset
    );
  };

  // Update employee calculations
  const updateEmployeeCalculations = (
    employee: PayrollEmployee
  ): PayrollEmployee => {
    const regularPay = calculateRegularPay(employee);
    const totalHrs = employee.totalHrs;
    const grossPay = calculateGrossPay({ ...employee, regularPay });

    return {
      ...employee,
      regularPay,
      totalHrs,
      grossPay,
    };
  };

  // Convert API employee to payroll employee
  const convertToPayrollEmployee = (apiEmployee: Employee): PayrollEmployee => {
    return {
      id: apiEmployee.id,
      taxes: apiEmployee.paySchedule.taxes,
      name: apiEmployee.details.name,
      baseSalary: apiEmployee.payTypes.salary,
      regularPay: 0,
      overtime: 0,
      sickPay: 0,
      vacationPay: 0,
      taxableOffset: 0,
      totalHrs: 0,
      grossPay: 0,
      payType: apiEmployee.payTypes.payType,
      ratePerHour: apiEmployee.payTypes.ratePerHour,
      hourPerDay: apiEmployee.payTypes.hourPerDay,
      dayPerWeek: apiEmployee.payTypes.dayPerWeek,
      createdAt: apiEmployee.createdAt,
      isEditing: false,
    };
  };

  // Initialize payroll employees from API data
  useEffect(() => {
    if (availableEmployees && availableEmployees.length > 0) {
      // Filter employees that are related to this payroll (you can modify this logic based on your needs)
      const relatedEmployees = availableEmployees.filter(
        (emp) =>
          emp.details.status === EmployeeStatus.ACTIVE &&
          // Add additional filtering logic here based on payrollId if needed
          // For example: emp.payrollId === payrollId
          true
      );

      const payrollEmpList = relatedEmployees.map((emp) => {
        const payrollEmp = convertToPayrollEmployee(emp);
        return updateEmployeeCalculations(payrollEmp);
      });

      setPayrollEmployees(payrollEmpList);
    }
  }, [availableEmployees, payrollId]);

  // Auto-calculate totals whenever employees change
  useEffect(() => {
    const calculateTotals = (): PayrollTotals => {
      return payrollEmployees.reduce(
        (totals, emp) => {
          totals.baseSalary += emp.baseSalary;
          totals.regularPay += emp.regularPay;
          totals.overtime += emp.overtime;
          totals.sickPay += emp.sickPay;
          totals.vacationPay += emp.vacationPay;
          totals.taxableOffset += emp.taxableOffset;
          totals.totalHrs += emp.totalHrs;
          totals.grossPay += emp.grossPay;
          return totals;
        },
        {
          baseSalary: 0,
          regularPay: 0,
          overtime: 0,
          sickPay: 0,
          vacationPay: 0,
          taxableOffset: 0,
          totalHrs: 0,
          grossPay: 0,
        }
      );
    };

    setTotals(calculateTotals());
  }, [payrollEmployees]);

  // Handle editing state
  const handleEditEmployee = (employee: PayrollEmployee): void => {
    setEditingEmployeeIds((prev) => new Set(prev).add(employee.id));
    setOriginalEmployeeData((prev) =>
      new Map(prev).set(employee.id, { ...employee })
    );
  };

  const handleSaveEdit = (employeeId: string): void => {
    setPayrollEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? updateEmployeeCalculations(emp) : emp
      )
    );
    setEditingEmployeeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(employeeId);
      return newSet;
    });
    setOriginalEmployeeData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(employeeId);
      return newMap;
    });
  };

  const handleCancelEdit = (employeeId: string): void => {
    const originalData = originalEmployeeData.get(employeeId);
    if (originalData) {
      setPayrollEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeId ? originalData : emp))
      );
    }
    setEditingEmployeeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(employeeId);
      return newSet;
    });
    setOriginalEmployeeData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(employeeId);
      return newMap;
    });
  };

  const handleDeleteEmployee = (id: string): void => {
    setPayrollEmployees(payrollEmployees.filter((emp) => emp.id !== id));
    setEditingEmployeeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setOriginalEmployeeData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const handleEmployeeSelect = (employeeId: string): void => {
    const selectedEmployee = availableEmployees.find(
      (emp) => emp.id === employeeId
    );
    if (selectedEmployee) {
      const payrollEmp = convertToPayrollEmployee(selectedEmployee);
      setNewEmployee(payrollEmp);
    }
  };

  const handleAddEmployee = (): void => {
    if (newEmployee.name.trim()) {
      const updatedEmployee = updateEmployeeCalculations(newEmployee);
      setPayrollEmployees([...payrollEmployees, updatedEmployee]);
      setNewEmployee({
        id: "",
        taxes: 0,
        name: "",
        baseSalary: 0,
        regularPay: 0,
        overtime: 0,
        sickPay: 0,
        vacationPay: 0,
        taxableOffset: 0,
        totalHrs: 0,
        grossPay: 0,
        payType: EmployeePaymentTypeOptions.HOURLY,
        ratePerHour: 0,
        hourPerDay: 8,
        dayPerWeek: 5,
        createdAt: new Date(),
      });
      setShowAddEmployee(false);
    }
  };

  const formatDisplayValue = (
    value: number,
    key: keyof PayrollEmployee
  ): string => {
    if (
      key === "baseSalary" ||
      key === "regularPay" ||
      key === "grossPay" ||
      key === "overtime" ||
      key === "sickPay" ||
      key === "vacationPay" ||
      key === "taxableOffset"
    ) {
      return value === 0 ? "$0" : `$${value.toLocaleString()}`;
    }
    if (key === "totalHrs") {
      return value === 0 ? "0h" : `${value}h`;
    }
    return value.toString();
  };

  const handleInputChange = (
    value: string,
    key: keyof PayrollEmployee,
    employeeId: string
  ): void => {
    setPayrollEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, [key]: key === "name" ? value : Number(value) }
          : emp
      )
    );
  };

  const handleNewEmployeeInputChange = (
    value: string,
    key: keyof PayrollEmployee
  ): void => {
    setNewEmployee((prev) => ({
      ...prev,
      [key]: key === "name" ? value : Number(value),
    }));
  };

  // Get available employees that haven't been added yet
  const getAvailableEmployeesForSelect = (): Employee[] => {
    const addedEmployeeIds = payrollEmployees.map((emp) => emp.id);
    return availableEmployees.filter(
      (emp) =>
        !addedEmployeeIds.includes(emp.id) &&
        emp.details.status === EmployeeStatus.ACTIVE
    );
  };

  // Auto-calculate for new employee
  useEffect(() => {
    if (newEmployee.id) {
      const updated = updateEmployeeCalculations(newEmployee);
      if (JSON.stringify(updated) !== JSON.stringify(newEmployee)) {
        setNewEmployee(updated);
      }
    }
  }, [
    newEmployee.overtime,
    newEmployee.sickPay,
    newEmployee.vacationPay,
    newEmployee.taxableOffset,
    newEmployee.totalHrs,
    newEmployee.payType,
    newEmployee.baseSalary,
    newEmployee.ratePerHour,
  ]);

  const handlePayroll = async () => {
    try {
      const data = {
        employees: payrollEmployees.map((emp) => ({
          ...emp,
          employeeId: emp.id,
        })),
        ...totals,
        taxes: payrollEmployees.reduce(
          (total, employee) => total + employee.taxes,
          0
        ),
        payDate: payDate,
        payPeriod: payPeriod,
        organizationId: organizationId,
      };
    } catch (error) {
      return
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payroll employees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Error loading payroll employees. Please try again.
          </p>
          <Button onClick={() => mutate()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payPeriod">Pay Period*</Label>
                  <div className="relative">
                    <Input
                      id="payPeriod"
                      type="text"
                      value={payPeriod}
                      onChange={(e) => setPayPeriod(e.target.value)}
                      className="w-64 pr-10"
                      placeholder="YYYY-MM-DD to YYYY-MM-DD"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payDate">Pay Date*</Label>
                  <div className="relative">
                    <Input
                      id="payDate"
                      type="text"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-40 pr-10"
                      placeholder="MM/DD/YYYY"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowAddEmployee(true)}
                className="bg-teal-500 hover:bg-teal-700"
                disabled={getAvailableEmployeesForSelect().length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add an Employee
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    {fields.map((field) => (
                      <TableHead key={field.key} className="whitespace-nowrap">
                        {field.label}
                      </TableHead>
                    ))}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Totals Row */}
                  <TableRow className="">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.baseSalary, "baseSalary")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.regularPay, "regularPay")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.overtime, "overtime")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.sickPay, "sickPay")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.vacationPay, "vacationPay")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(
                        totals.taxableOffset,
                        "taxableOffset"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDisplayValue(totals.totalHrs, "totalHrs")}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatDisplayValue(totals.grossPay, "grossPay")}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Employee Rows */}
                  {payrollEmployees.map((employee) => {
                    const isEditing = editingEmployeeIds.has(employee.id);

                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        {fields.map((field) => (
                          <TableCell key={field.key}>
                            {isEditing && field.editable ? (
                              <Input
                                type={field.type}
                                value={employee[field.key]?.toString() || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    field.key,
                                    employee.id
                                  )
                                }
                                className="h-8"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <span
                                className={
                                  field.key === "grossPay"
                                    ? "font-medium text-green-600"
                                    : ""
                                }
                              >
                                {formatDisplayValue(
                                  employee[field.key] as number,
                                  field.key
                                )}
                              </span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  onClick={() => handleSaveEdit(employee.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleCancelEdit(employee.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                                >
                                  ×
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleEditEmployee(employee)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteEmployee(employee.id)
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Add Employee Row */}
                  {showAddEmployee && (
                    <TableRow className="">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      {fields.map((field) => (
                        <TableCell key={field.key}>
                          {field.key === "name" ? (
                            <Select
                              onValueChange={handleEmployeeSelect}
                              value={newEmployee.id}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableEmployeesForSelect().map((emp) => (
                                  <SelectItem key={emp.id} value={emp.id}>
                                    {emp.details.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.key === "baseSalary" ||
                            field.key === "grossPay" ||
                            field.key === "regularPay" ? (
                            <span
                              className={
                                field.key === "grossPay"
                                  ? "text-green-600 font-medium"
                                  : ""
                              }
                            >
                              {formatDisplayValue(
                                newEmployee[field.key] as number,
                                field.key
                              )}
                            </span>
                          ) : (
                            <Input
                              type={field.type}
                              value={newEmployee[field.key]?.toString() || ""}
                              onChange={(e) =>
                                handleNewEmployeeInputChange(
                                  e.target.value,
                                  field.key
                                )
                              }
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="h-8"
                              min="0"
                              step="0.01"
                            />
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleAddEmployee}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
                            disabled={!newEmployee.name || !newEmployee.id}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddEmployee(false);
                              setNewEmployee({
                                id: "",
                                taxes: 0,
                                name: "",
                                baseSalary: 0,
                                regularPay: 0,
                                overtime: 0,
                                sickPay: 0,
                                vacationPay: 0,
                                taxableOffset: 0,
                                totalHrs: 0,
                                grossPay: 0,
                                payType: EmployeePaymentTypeOptions.HOURLY,
                                ratePerHour: 0,
                                hourPerDay: 8,
                                dayPerWeek: 5,
                                createdAt: new Date(),
                              });
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                          >
                            ×
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    payrollEmployees.reduce(
                      (total, employee) => total + employee.taxes,
                      0
                    )
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Taxes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {payrollEmployees.length}
                </div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${totals.grossPay.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Gross Pay</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totals.totalHrs}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${totals.baseSalary.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Base Salary</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">©Kenzi Books</div>
          <div className="flex gap-3">
            <Button
              className="bg-teal-500 hover:bg-teal-700"
              onClick={() => handlePayroll()}
            >
              Payroll
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
