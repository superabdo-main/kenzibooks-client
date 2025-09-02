import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { Employee, EmployeePaySchedule } from "@/types/employee.type";

type EmployeeState = {
  error: string | null;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  isLoading: boolean;
  createEmployee: ({
    employee,
    accessToken,
  }: {
    employee: Employee;
    accessToken: string;
  }) => Promise<ApiResponse<Employee>>;
  updateEmployee: ({
    id,
    employee,
    accessToken,
  }: {
    id: string;
    employee: Employee;
    accessToken: string;
  }) => Promise<ApiResponse<Employee>>;
  deleteEmployee: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<Employee>>;
  createPayroll: ({
    payrollSchedule,
    accessToken,
  }: {
    payrollSchedule: EmployeePaySchedule;
    accessToken: string;
  }) => Promise<ApiResponse<EmployeePaySchedule>>;
  updatePayroll: ({
    id,
    payrollSchedule,
    accessToken,
  }: {
    id: string;
    payrollSchedule: EmployeePaySchedule;
    accessToken: string;
  }) => Promise<ApiResponse<EmployeePaySchedule>>;
  deletePayroll: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<EmployeePaySchedule>>;
};

export const useEmployeesStore = create<EmployeeState>((set, get) => ({
  error: null,
  employees: [],
  setEmployees: (employees) => set(() => ({ employees })),
  isLoading: false,
  createEmployee: async ({
    employee,
    accessToken,
  }: {
    employee: Employee;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/create-employee`,
        options: {
          method: "POST",
          body: JSON.stringify(employee),
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create employee";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updateEmployee: async ({
    id,
    employee,
    accessToken,
  }: {
    id: string;
    employee: Employee;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(employee),
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update employee";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  deleteEmployee: async ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/${id}`,
        options: {
          method: "DELETE",
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete employee";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  createPayroll: async ({
    payrollSchedule,
    accessToken,
  }: {
    payrollSchedule: EmployeePaySchedule;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/create-payroll-schedule`,
        options: {
          method: "POST",
          body: JSON.stringify(payrollSchedule),
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create payroll schedule";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updatePayroll: async ({
    id,
    payrollSchedule,
    accessToken,
  }: {
    id: string;
    payrollSchedule: EmployeePaySchedule;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/update-payroll-schedule/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(payrollSchedule),
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update payroll schedule";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  deletePayroll: async ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/employee/delete-payroll-schedule/${id}`,
        options: {
          method: "DELETE",
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete payroll schedule";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));