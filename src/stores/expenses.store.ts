import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

// Types based on your DTOs
export interface Expense {
  id: string;
  reference: string;
  type: "FIXED" | "RECURRING";
  expenseFor: string;
  amount: number;
  categoryId: string;
  repeatEvery: number | undefined;
  startDate: Date;
  organizationId: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  organizationId: string;
}

export interface ExpenseSubCategory {
  id: string;
  name: string;
  categoryId: string;
}

// Create DTOs
export interface CreateExpenseDto {
  reference: string;
  type: "FIXED" | "RECURRING";
  expenseFor: string;
  amount: number;
  categoryId: string;
  repeatEvery: number;
  startDate: Date;
  organizationId: string;
}

export interface CreateExpenseCategoryDto {
  name: string;
  organizationId: string;
}

export interface CreateExpenseSubCategoryDto {
  name: string;
  categoryId: string;
  organizationId: string;
}

// Update DTOs
export interface UpdateExpenseDto {
  id: string;
  reference?: string;
  type?: "FIXED" | "RECURRING";
  expenseFor?: string;
  amount?: number;
  categoryId?: string;
  repeatEvery?: number;
  startDate?: Date;
  organizationId?: string;
}

export interface UpdateExpenseCategoryDto {
  id: string;
  name?: string;
  organizationId?: string;
}

export interface UpdateExpenseSubCategoryDto {
  id: string;
  name?: string;
  categoryId?: string;
}

type ExpenseStoreState = {
  error: string | null;
  isLoading: boolean;
  expenses: Expense[];
  categories: ExpenseCategory[];
  subCategories: ExpenseSubCategory[];

  // Utility methods
  setExpenses: (expenses: Expense[]) => void;
  setCategories: (categories: ExpenseCategory[]) => void;
  setSubCategories: (subCategories: ExpenseSubCategory[]) => void;
  toggleFetch: () => void;

  // Run methods
  runExpense: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;

  // Expense methods
  createExpense: ({
    expenseData,
    accessToken,
  }: {
    expenseData: CreateExpenseDto;
    accessToken: string;
  }) => Promise<ApiResponse<Expense>>;

  updateExpense: ({
    expenseData,
    accessToken,
  }: {
    expenseData: UpdateExpenseDto;
    accessToken: string;
  }) => Promise<ApiResponse<Expense>>;

  deleteExpense: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;

  deleteExpenseInstance: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;

  // Category methods
  createCategory: ({
    name,
    accessToken,
    organizationId,
  }: {
    name: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<ExpenseCategory>>;

  updateCategory: ({
    id,
    name,
    accessToken,
    organizationId,
  }: {
    id: string;
    name?: string;
    accessToken: string;
    organizationId?: string;
  }) => Promise<ApiResponse<ExpenseCategory>>;

  deleteCategory: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;

  // SubCategory methods
  createSubCategory: ({
    name,
    categoryId,
    organizationId,
    accessToken,
  }: {
    name: string;
    categoryId: string;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<ExpenseSubCategory>>;

  updateSubCategory: ({
    id,
    name,
    categoryId,
    accessToken,
  }: {
    id: string;
    name?: string;
    categoryId?: string;
    accessToken: string;
  }) => Promise<ApiResponse<ExpenseSubCategory>>;

  deleteSubCategory: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;
};

export const useExpenseStore = create<ExpenseStoreState>((set) => ({
  error: null,
  isLoading: false,
  expenses: [],
  categories: [],
  subCategories: [],

  // Utility methods
  setExpenses: (expenses) => set(() => ({ expenses })),
  setCategories: (categories) => set(() => ({ categories })),
  setSubCategories: (subCategories) => set(() => ({ subCategories })),
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),

  // Expense methods
  runExpense: async ({
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
        endpoint: `/expenses/run-generate/${id}`,
        options: {
          method: "POST",
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
        error instanceof Error ? error.message : "Failed to run expense";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  createExpense: async ({
    expenseData,
    accessToken,
  }: {
    expenseData: CreateExpenseDto;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/create/expense`,
        options: {
          method: "POST",
          body: JSON.stringify(expenseData),
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
        error instanceof Error ? error.message : "Failed to create expense";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateExpense: async ({
    expenseData,
    accessToken,
  }: {
    expenseData: UpdateExpenseDto;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/update/expense`,
        options: {
          method: "PATCH",
          body: JSON.stringify(expenseData),
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
        error instanceof Error ? error.message : "Failed to update expense";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteExpense: async ({
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
        endpoint: `/expenses/delete/expense/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete expense";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteExpenseInstance: async ({
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
        endpoint: `/expenses/delete/expense-instance/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete expense";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  // Category methods
  createCategory: async ({
    name,
    accessToken,
    organizationId,
  }: {
    name: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/create/category/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ name, organizationId }),
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
        error instanceof Error ? error.message : "Failed to create category";

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
    name?: string;
    accessToken: string;
    organizationId?: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const updateData: UpdateExpenseCategoryDto = { id };
      if (name) updateData.name = name;
      if (organizationId) updateData.organizationId = organizationId;

      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/update/category`,
        options: {
          method: "PATCH",
          body: JSON.stringify(updateData),
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
        error instanceof Error ? error.message : "Failed to update category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteCategory: async ({
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
        endpoint: `/expenses/delete/category/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete category";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  // SubCategory methods
  createSubCategory: async ({
    name,
    categoryId,
    organizationId,
    accessToken,
  }: {
    name: string;
    categoryId: string;
    organizationId: string;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/create/subcategory`,
        options: {
          method: "POST",
          body: JSON.stringify({ name, categoryId, organizationId }),
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
        error instanceof Error ? error.message : "Failed to create subcategory";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateSubCategory: async ({
    id,
    name,
    categoryId,
    accessToken,
  }: {
    id: string;
    name?: string;
    categoryId?: string;
    accessToken: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const updateData: UpdateExpenseSubCategoryDto = { id };
      if (name) updateData.name = name;
      if (categoryId) updateData.categoryId = categoryId;

      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/expenses/update/subcategory`,
        options: {
          method: "PATCH",
          body: JSON.stringify(updateData),
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
        error instanceof Error ? error.message : "Failed to update subcategory";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteSubCategory: async ({
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
        endpoint: `/expenses/delete/subcategory/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete subcategory";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));
