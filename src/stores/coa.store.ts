import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { ChartOfAccount } from "@/types/coa.type";

type CoaState = {
  error: string | null;
  accounts: ChartOfAccount[];
  setAccounts: (accounts: ChartOfAccount[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  createAccount: ({
    accountType,
    accountDetail,
    accountName,
    description,
    balance,
    payOf,
    accessToken,
    organizationId,
  }: {
    accountType: string;
    accountDetail: string;
    accountName: string;
    description?: string;
    balance?: number;
    payOf?: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<ChartOfAccount>>;
  findAccountById: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<ChartOfAccount>>;
  updateAccount: ({
    id,
    accountType,
    accountDetail,
    accountName,
    description,
    balance,
    payOf,
    accessToken,
  }: {
    id: string;
    accountType?: string;
    accountDetail?: string;
    accountName?: string;
    description?: string;
    balance?: number;
    payOf?: string;
    accessToken: string;
  }) => Promise<ApiResponse<ChartOfAccount>>;
  deleteAccount: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;
};

export const useCoaStore = create<CoaState>((set) => ({
  error: null,
  accounts: [],
  setAccounts: (accounts) => set(() => ({ accounts })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  
  createAccount: async ({
    accountType,
    accountDetail,
    accountName,
    description,
    balance,
    payOf,
    accessToken,
    organizationId,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/coa/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ 
            accountType, 
            accountDetail, 
            accountName,
            description,
            balance,
            payOf,
          }),
        },
      });
      
      if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  findAccountById: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/coa/findone/${id}`,
      });
      
      if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch account";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateAccount: async ({
    id,
    accountType,
    accountDetail,
    accountName,
    description,
    balance,
    payOf,
    accessToken,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/coa/update/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({
            accountType,
            accountDetail,
            accountName,
            description,
            balance,
            payOf,
          }),
        },
      });
      
      if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update account";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteAccount: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/coa/delete/${id}`,
        options: {
          method: "DELETE",
        },
      });
      
      if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
})); 