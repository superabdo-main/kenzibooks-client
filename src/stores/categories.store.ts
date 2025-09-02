import { create } from "zustand";
import { generateMockCategories } from "@/app/[locale]/dashboard/(warehouse-managment)/categories/mock";
import { Category } from "@/types/category";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

type CategoriesState = {
  error: string | null;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  fetchCategories: () => void;
  createCategory: ({
    name,
    accessToken,
    organizationId,
  }: {
    name: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse>;
  findById: ({
    id,
    accessToken,
    organizationId,
  }: {
    id: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<Category>>;
  updateCategory: ({
    id,
    name,
    accessToken,
    organizationId,
  }: {
    id: string;
    name: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<Category>>;
  deleteCategory: ({
    id,
    accessToken,
    organizationId,
  }: {
    id: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse>;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  error: null,
  categories: [],
  setCategories: (categories) => set(() => ({ categories })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchCategories: () =>
    set((state) => ({
      isLoading: true,
      categories: generateMockCategories(20),
    })),
  deleteCategory: async ({
    id,
    accessToken,
    organizationId,
  }: {
    id: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/category/delete/${organizationId}/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  createCategory: async ({
    name,
    accessToken,
    organizationId,
  }: {
    name: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/category/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ name }),
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
        error instanceof Error ? error.message : "Failed to create category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  findById: async ({
    id,
    accessToken,
    organizationId,
  }: {
    id: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/category/findone/${organizationId}/${id}`,
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
        error instanceof Error ? error.message : "Failed to find category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateCategory: async ({
    id,
    name,
    accessToken,
    organizationId,
  }: {
    id: string;
    name: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/category/update/${organizationId}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({ id, name }),
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
        error instanceof Error ? error.message : "Failed to update category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));
