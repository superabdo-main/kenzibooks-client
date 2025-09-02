import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { FixedAsset } from "@/types/fixed-assets.type";

type FixedAssetsState = {
  error: string | null;
  assets: FixedAsset[];
  setAssets: (assets: FixedAsset[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  createAsset: ({
    assetName,
    description,
    purchaseDate,
    purchaseCost,
    assetCategory,
    depreciationMethod,
    usefulLife,
    salvageValue,
    currentValue,
    location,
    status,
    notes,
    accessToken,
    organizationId,
  }: {
    assetName: string;
    description?: string;
    purchaseDate: string;
    purchaseCost: number;
    assetCategory: string;
    depreciationMethod: string;
    usefulLife: number;
    salvageValue: number;
    currentValue?: number;
    location?: string;
    status: string;
    notes?: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<FixedAsset>>;
  findAssetById: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse<FixedAsset>>;
  updateAsset: ({
    id,
    assetName,
    description,
    purchaseDate,
    purchaseCost,
    assetCategory,
    depreciationMethod,
    usefulLife,
    salvageValue,
    currentValue,
    location,
    status,
    notes,
    accessToken,
  }: {
    id: string;
    assetName?: string;
    description?: string;
    purchaseDate?: string;
    purchaseCost?: number;
    assetCategory?: string;
    depreciationMethod?: string;
    usefulLife?: number;
    salvageValue?: number;
    currentValue?: number;
    location?: string;
    status?: string;
    notes?: string;
    accessToken: string;
  }) => Promise<ApiResponse<FixedAsset>>;
  deleteAsset: ({
    id,
    accessToken,
  }: {
    id: string;
    accessToken: string;
  }) => Promise<ApiResponse>;
  calculateDepreciation: ({
    id,
    asOfDate,
    accessToken,
  }: {
    id: string;
    asOfDate: string;
    accessToken: string;
  }) => Promise<ApiResponse<any>>;
};

export const useFixedAssetsStore = create<FixedAssetsState>((set) => ({
  error: null,
  assets: [],
  setAssets: (assets) => set(() => ({ assets })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  
  createAsset: async ({
    assetName,
    description,
    purchaseDate,
    purchaseCost,
    assetCategory,
    depreciationMethod,
    usefulLife,
    salvageValue,
    currentValue,
    location,
    status,
    notes,
    accessToken,
    organizationId,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/fixed-assets/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify({ 
            assetName,
            description,
            purchaseDate,
            purchaseCost,
            assetCategory,
            depreciationMethod,
            usefulLife,
            salvageValue,
            currentValue,
            location,
            status,
            notes,
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
        error instanceof Error ? error.message : "Failed to create fixed asset";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  findAssetById: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/fixed-assets/findone/${id}`,
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
        error instanceof Error ? error.message : "Failed to fetch fixed asset";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateAsset: async ({
    id,
    assetName,
    description,
    purchaseDate,
    purchaseCost,
    assetCategory,
    depreciationMethod,
    usefulLife,
    salvageValue,
    currentValue,
    location,
    status,
    notes,
    accessToken,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/fixed-assets/update/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({
            assetName,
            description,
            purchaseDate,
            purchaseCost,
            assetCategory,
            depreciationMethod,
            usefulLife,
            salvageValue,
            currentValue,
            location,
            status,
            notes,
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
        error instanceof Error ? error.message : "Failed to update fixed asset";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteAsset: async ({ id, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/fixed-assets/delete/${id}`,
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
        error instanceof Error ? error.message : "Failed to delete fixed asset";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  calculateDepreciation: async ({ id, asOfDate, accessToken }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/fixed-assets/depreciation/${id}?asOfDate=${encodeURIComponent(asOfDate)}`,
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
        error instanceof Error ? error.message : "Failed to calculate depreciation";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
})); 