import { generateMockProducts } from "@/app/[locale]/dashboard/(warehouse-managment)/products/mock";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { create } from "zustand";

interface CreateProductDto {
  type: 'PRODUCT' | 'SERVICE';
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;

  taxType: 'NON_TAXABLE' | 'NON_TAXABLE';
  taxCode?: string;

  purchasePrice?: number;
  salePrice?: number;

  categoryId?: string;
  warehouseId?: string;
  quantity?: number | 0;
}


type productsState = {
  products: any[];
  setProducts: (products: any[]) => void;
  isLoading: boolean;
  error: string | null;
  toggleFetch: () => void;
  fetchProducts: () => void;
  createProduct: ({product, accessToken, organizationId}: {product: CreateProductDto, accessToken: string, organizationId: string}) => void;
  getProductById: ({productId, accessToken, organizationId}: {productId: string, accessToken: string, organizationId: string}) => Promise<ApiResponse<CreateProductDto>>;
  updateProduct: ({product, accessToken, organizationId}: {product: CreateProductDto, accessToken: string, organizationId: string}) => Promise<ApiResponse<CreateProductDto>>;
  deleteProduct: ({productId, accessToken, organizationId}: {productId: string, accessToken: string, organizationId: string}) => Promise<ApiResponse>;
};

export const useProductsStore = create<productsState>((set) => ({
  products: [],
  setProducts: (products) => set(() => ({ products: products })),
  isLoading: false,
  error: null,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchProducts: () =>
    set((state) => ({ isLoading: true, products: generateMockProducts(50) })),

  createProduct: async ({product, accessToken, organizationId}: {product: CreateProductDto, accessToken: string, organizationId: string}) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/product/create/${organizationId}`,
        options: {
          method: "POST",
          body: JSON.stringify(product),
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
          : "Failed to create product";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  
  getProductById: async ({productId, accessToken, organizationId}: {productId: string, accessToken: string, organizationId: string}) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/product/findone/${organizationId}/${productId}`,
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
          : "Failed to create product";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateProduct: async ({product, accessToken, organizationId}: {product: CreateProductDto, accessToken: string, organizationId: string}) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/product/update/${organizationId}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(product),
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
          : "Failed to create product";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteProduct: async ({productId, accessToken, organizationId}: {productId: string, accessToken: string, organizationId: string}) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/product/delete/${organizationId}/${productId}`,
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
          : "Failed to create product";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

}));
