import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { ExpenseCategory, ExpenseSubCategory } from "@/types/expenses.type";

// Types based on the Revenue model and DTOs
export interface Revenue {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  categoryId?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category?: ExpenseSubCategory;
}


// Create DTOs
export interface CreateRevenueDto {
  amount: number;
  date: string;
  description?: string;
  categoryId?: string;
  organizationId: string;
}

// Update DTOs
export interface UpdateRevenueDto {
  id: string;
  amount?: number;
  date?: string;
  description?: string;
  categoryId?: string;
}

type RevenueStoreState = {
  error: string | null;
  isLoading: boolean;
  revenues: Revenue[];
  categories: ExpenseCategory[];

  // Utility methods
  setRevenues: (revenues: Revenue[]) => void;
  setCategories: (categories: ExpenseCategory[]) => void;
  toggleFetch: () => void;

  // Revenue methods
  createRevenue: ({
    revenueData,
    accessToken,
  }: {
    revenueData: CreateRevenueDto;
    accessToken: string;
  }) => Promise<ApiResponse<Revenue>>;

  deleteRevenue: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;

  getCategories: ({
    organizationId,
    accessToken,
  }: {
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<ExpenseSubCategory[]>>;
};

export const useRevenueStore = create<RevenueStoreState>((set) => ({
  error: null,
  isLoading: false,
  revenues: [],
  categories: [],

  // Utility methods
  setRevenues: (revenues) => set(() => ({ revenues })),
  setCategories: (categories) => set(() => ({ categories })),
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),

  // Revenue methods
  createRevenue: async ({
    revenueData,
    accessToken,
  }: {
    revenueData: CreateRevenueDto;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/revenue/create`,
        options: {
          method: "POST",
          body: JSON.stringify(revenueData),
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
        error instanceof Error ? error.message : "Failed to create revenue";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteRevenue: async ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/revenue/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete revenue";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  getCategories: async ({
    organizationId,
    accessToken,
  }: {
    organizationId: string;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      // Reuse the existing expense categories endpoint as specified in the design
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/categories/${organizationId}`,
        options: {
          method: "GET",
        },
      });

      if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      } else {
        // Update the categories in the store
        if (response.data) {
          set({
            categories: response.data,
            isLoading: false,
          });
        } else {
          set({
            isLoading: false,
          });
        }
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch categories";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));