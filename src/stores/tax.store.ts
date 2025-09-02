import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { Tax } from "@/types/tax";

type TaxState = {
  error: string | null;
  taxes: Tax[];
  setTaxes: (taxes: Tax[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  createTax: ({
    name,
    rate,
    description,
    applyOn,
    specificProductIds,
    accessToken,
    organizationId,
  }: {
    name: string;
    rate: number;
    description?: string;
    applyOn: "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS";
    specificProductIds?: string[];
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<Tax>>;
  findTaxById: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<Tax>>;
  updateTax: ({
    id,
    name,
    rate,
    description,
    applyOn,
    specificProductIds,
    accessToken,
    organizationId,
  }: {
    id: string;
    name: string;
    rate: number;
    description?: string;
    applyOn: "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS";
    specificProductIds?: string[];
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<Tax>>;
  deleteTax: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;
};

export const useTaxStore = create<TaxState>((set) => ({
  error: null,
  taxes: [],
  setTaxes: (taxes) => set(() => ({ taxes })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  
  createTax: async ({
    name,
    rate,
    description,
    applyOn,
    specificProductIds,
    accessToken,
    organizationId,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/tax/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ 
            name, 
            rate, 
            description,
            applyOn,
            specificProductIds: specificProductIds || [],
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
        error instanceof Error ? error.message : "Failed to create tax";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  findTaxById: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/tax/findone/${id}`,
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
        error instanceof Error ? error.message : "Failed to fetch tax";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateTax: async ({
    id,
    name,
    rate,
    description,
    applyOn,
    specificProductIds,
    accessToken,
    organizationId,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/tax/update/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({
            name,
            rate,
            description,
            applyOn,
            specificProductIds: specificProductIds || [],
            organizationId,
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
        error instanceof Error ? error.message : "Failed to update tax";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteTax: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/tax/delete/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete tax";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
})); 