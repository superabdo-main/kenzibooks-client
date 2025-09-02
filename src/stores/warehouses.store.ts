import { create } from "zustand";
import { generateMockWarehouses } from "@/app/[locale]/dashboard/(warehouse-managment)/warehouses/mock";
import { WarehouseType } from "@/types/warehouses.type";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

type WarehousesState = {
  warehouses: WarehouseType[];
  setWarehouses: (warehouses: WarehouseType[]) => void;
  isLoading: boolean;
  error: string | null;
  toggleFetch: () => void;
  fetchWarehouses: () => void;
  createWarehouse: ({
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
  }) => Promise<ApiResponse<WarehouseType>>;
  updateWarehouse: ({
    id,
    name,
    accessToken,
    organizationId,
  }: {
    id: string;
    name: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<WarehouseType>>;
  deleteWarehouse: ({
    id,
    accessToken,
    organizationId,
  }: {
    id: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse>;
};

export const useWarehousesStore = create<WarehousesState>((set) => ({
  warehouses: [],
  setWarehouses: (warehouses) => set(() => ({ warehouses })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchWarehouses: () =>
    set((state) => ({
      isLoading: true,
      warehouses: generateMockWarehouses(20),
    })),
  error: null,
  deleteWarehouse: async ({
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
        endpoint: `/warehouse/delete/${organizationId}/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete warehouse";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  createWarehouse: async ({
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
        endpoint: `/warehouse/create/${organizationId}`,
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
        error instanceof Error ? error.message : "Failed to create warehouse";

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
        endpoint: `/warehouse/findone/${organizationId}/${id}`,
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
        error instanceof Error ? error.message : "Failed to find warehouse";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateWarehouse: async ({
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
        endpoint: `/warehouse/update/${organizationId}`,
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
        error instanceof Error ? error.message : "Failed to update warehouse";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));
