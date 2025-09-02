import { create } from "zustand";
import { PurchaseType } from "@/types/purchases.type";
import { generateMockPurchases } from "@/app/[locale]/dashboard/(Procurement-Management)/purchases/mock";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

type PurchasesState = {
  error: string | null;
  purchases: PurchaseType[];
  setPurchases: (purchases: PurchaseType[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  fetchPurchases: () => void;
  createPurchase: ({
    purchase,
    accessToken,
    organizationId,
  }: {
    purchase: PurchaseType;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<PurchaseType>>;
  fetchPurchaseById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<PurchaseType>>;
  updatePurchaseById: ({
    accessToken,
    id,
    updatePurchaseDto,
  }: {
    accessToken: string;
    id: string;
    updatePurchaseDto: PurchaseType;
  }) => Promise<ApiResponse<PurchaseType>>;
  proccessPaymentById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<PurchaseType>>;
  deletePurchaseById: ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => Promise<ApiResponse<PurchaseType>>;
};

export const usePurchasesStore = create<PurchasesState>((set, get) => ({
  error: null,
  purchases: [],
  setPurchases: (purchases) => set(() => ({ purchases })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchPurchases: () =>
    set(() => ({ isLoading: true, purchases: generateMockPurchases(20) })),
  createPurchase: async ({
    purchase,
    accessToken,
    organizationId,
  }: {
    purchase: PurchaseType;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/purchase/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ ...purchase }),
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
        error instanceof Error ? error.message : "Failed to create purchase";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  fetchPurchaseById: async ({
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
        endpoint: `/purchase/findone/${id}`,
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
        error instanceof Error ? error.message : "Failed to fetch purchase";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updatePurchaseById: async ({
    accessToken,
    id,
    updatePurchaseDto,
  }: {
    accessToken: string;
    id: string;
    updatePurchaseDto: PurchaseType;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/purchase/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({ ...updatePurchaseDto }),
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
        error instanceof Error ? error.message : "Failed to update purchase";

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
        endpoint: `/purchase/payment/${id}`,
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
  deletePurchaseById: async ({
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
        endpoint: `/purchase/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete purchase";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  
}));
