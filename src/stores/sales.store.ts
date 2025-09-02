import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { SaleType } from "@/types/sales.type";

type SaleState = {
  error: string | null;
  sales: SaleType[];
  setSales: (sales: SaleType[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  createSale: ({
    sale,
    accessToken,
    organizationId,
  }: {
    sale: SaleType;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<SaleType>>;
  fetchSaleById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<SaleType>>;
  updateSaleById: ({
    accessToken,
    id,
    updateSaleDto,
  }: {
    accessToken: string;
    id: string;
    updateSaleDto: SaleType;
  }) => Promise<ApiResponse<SaleType>>;
  proccessPaymentById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<SaleType>>;
  deleteSaleById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<SaleType>>;
};

export const useSalesStore = create<SaleState>((set, get) => ({
  error: null,
  sales: [],
  setSales: (sales) => set(() => ({ sales })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  createSale: async ({
    sale,
    accessToken,
    organizationId,
  }: {
    sale: SaleType;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/sale/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ ...sale }),
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
        error instanceof Error ? error.message : "Failed to create sale";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  fetchSaleById: async ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/sale/findone/${id}`,
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
        error instanceof Error ? error.message : "Failed to fetch sale";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updateSaleById: async ({
    accessToken,
    id,
    updateSaleDto,
  }: {
    accessToken: string;
    id: string;
    updateSaleDto: SaleType;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/sale/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({ ...updateSaleDto }),
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
        error instanceof Error ? error.message : "Failed to update sale";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  proccessPaymentById: async ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/sale/payment/${id}`,
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
        error instanceof Error ? error.message : "Failed to process payment";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  deleteSaleById: async ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/sale/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete sale";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  
}));
