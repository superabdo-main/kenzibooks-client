import { create } from "zustand";
import { SupplierType } from "@/types/suppliers.type";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

type SuppliersState = {
  error: string | null;
  suppliers: SupplierType[];
  setSuppliers: (suppliers: SupplierType[]) => void;
  isLoading: boolean;
  createSupplier: ({
    supplier,
    organizationId,
    accessToken,
  }: {
    supplier: SupplierType;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<SupplierType>>;
  getSupplierById: ({
    id,
    organizationId,
    accessToken,
  }: {
    id: string;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<SupplierType>>;
  updateSupplier: ({
    id,
    supplier,
    organizationId,
    accessToken,
  }: {
    id: string;
    supplier: SupplierType;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<SupplierType>>;
  deleteSupplier: ({
    id,
    organizationId,
    accessToken,
  }: {
    id: string;
    organizationId: string;
    accessToken: string;
  }) => Promise<ApiResponse<SupplierType>>;
};

export const useSuppliersStore = create<SuppliersState>((set, get) => ({
  error: null,
  suppliers: [],
  setSuppliers: (suppliers) => set(() => ({ suppliers })),
  isLoading: false,
  createSupplier: async ({
    supplier,
    organizationId,
    accessToken,
  }: {
    supplier: SupplierType;
    organizationId: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/supplier/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify(supplier),
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
          : "Failed to create supplier";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  getSupplierById: async ({
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
        endpoint: `/supplier/${organizationId}/${id}`,
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
          : "Failed to get supplier";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  updateSupplier: async ({
    id,
    supplier,
    organizationId,
    accessToken,
  }: {
    id: string;
    supplier: SupplierType;
    organizationId: string;
    accessToken: string;
  }) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/supplier/${organizationId}/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(supplier),
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
          : "Failed to update supplier";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
  deleteSupplier: async ({
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
        endpoint: `/supplier/${organizationId}/${id}`,
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
          : "Failed to delete supplier";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

}));
