import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { CustomerType, DepositType } from "@/types/customers";

type CustomerState = {
  error: string | null;
  customers: CustomerType[];
  setCustomers: (customers: CustomerType[]) => void;
  isLoading: boolean;
  createCustomer: ({
    customer,
    organizationId,
    accessToken,
  }: {
    customer: CustomerType;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<CustomerType>>;
  getCustomerById: ({
    id,
    organizationId,
    accessToken,
  }: {
    id: string;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<CustomerType>>;
  updateCustomer: ({
    id,
    customer,
    accessToken,
  }: {
    id: string;
    customer: CustomerType;
    accessToken: string;
  }) => Promise<ApiResponse<CustomerType>>;
  deleteCustomer: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<CustomerType>>;
  addDeposit: ({
    id,
    deposit,
    accessToken,
    organizationId,
  }: {
    id: string;
    deposit: DepositType;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<CustomerType>>;
};

export const useCustomersStore = create<CustomerState>((set, get) => ({
  error: null,
  customers: [],
  setCustomers: (customers) => set(() => ({ customers })),
  isLoading: false,
  createCustomer: async ({
    customer,
    organizationId,
    accessToken,
  }: {
    customer: CustomerType;
    organizationId: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/customer/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify(customer),
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
          : "Failed to create customer";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  getCustomerById: async ({
    id,
    organizationId,
    accessToken,
  }: {
    id: string;
    organizationId: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/customer/findone/${id}/${organizationId}`,
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
          : "Failed to get customer";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updateCustomer: async ({
    id,
    customer,
    accessToken,
  }: {
    id: string;
    customer: CustomerType;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/customer/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(customer),
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
          : "Failed to update customer";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  deleteCustomer: async ({
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
        endpoint: `/customer/${id}`,
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
          : "Failed to delete customer";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  addDeposit: async ({
    id,
    deposit,
    accessToken,
    organizationId,
  }: {
    id: string;
    deposit: DepositType;
    accessToken: string;
    organizationId: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/customer/add-deposit/${id}/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify(deposit),
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
          : "Failed to add deposit";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));
