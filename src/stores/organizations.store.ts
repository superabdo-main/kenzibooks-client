import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

export interface Organization {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  subscription: {
    isDemo: boolean;
    isActive: boolean;
    period: number;
    expiresAt: string;
  };
  icon: string | null;
}

interface FetchOrganizationsParams {
  userId: string;
  accessToken: string;
}

interface CreateOrganizationParams {
  name: string;
  icon: string;
  ownerId: string;
  accessToken: string;
}

interface FetchOrganizationByIdParams {
  userId: string;
  organizationId: string;
  accessToken: string;
}

interface UpdateOrganizationParams {
  id: string;
  name: string;
  icon: string;
  accessToken: string;
}

interface DeleteOrganizationParams {
  id: string;
  accessToken: string;
}

interface OrganizationsStore {
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;

  // Actions
  fetchOrganizations: (params: FetchOrganizationsParams) => Promise<void>;
  fetchOrganizationById: ({
    userId,
    organizationId,
    accessToken,
  }: FetchOrganizationByIdParams) => Promise<ApiResponse<Organization>>;
  createOrganization: (
    params: CreateOrganizationParams
  ) => Promise<ApiResponse<Organization>>;
  updateOrganization: (
    {id, name, icon, accessToken}: UpdateOrganizationParams
  ) => Promise<ApiResponse<Organization>>;
  deleteOrganization: (
    {id, accessToken}: DeleteOrganizationParams
  ) => Promise<ApiResponse<Organization>>;
  clearError: () => void;
  reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const useOrganizationsStore = create<OrganizationsStore>((set, get) => ({
  organizations: [],
  isLoading: true,
  error: null,
  lastFetch: null,

  fetchOrganizations: async ({ userId, accessToken }) => {
    const state = get();

    // Check if we have cached data that's still fresh
    if (
      state.organizations.length > 0 &&
      state.lastFetch &&
      Date.now() - state.lastFetch < CACHE_DURATION
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/organization/connected-organizations/${userId}`,
        options: {
          method: "GET",
        },
      });

      set({
        organizations: response.data || [],
        isLoading: false,
        lastFetch: Date.now(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch organizations";

      set({
        error: errorMessage,
        isLoading: false,
        organizations: [], // Clear stale data on error
      });

      throw error;
    }
  },

  createOrganization: async ({
    name,
    icon,
    ownerId,
    accessToken,
  }: CreateOrganizationParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/organization`,
        options: {
          method: "POST",
          body: JSON.stringify({ name, ownerId, icon }),
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
          : "Failed to create organization";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  fetchOrganizationById: async ({
    userId,
    organizationId,
    accessToken,
  }: FetchOrganizationByIdParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/organization/findone/${userId}/${organizationId}`,
        options: {
          method: "GET",
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
          : "Failed to create organization";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateOrganization: async ({
    id,
    accessToken,
    name,
    icon,
  }: UpdateOrganizationParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/organization/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify({ name, icon }),
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
          : "Failed to update organization";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteOrganization: async ({ id, accessToken }: DeleteOrganizationParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/organization/${id}`,
        options: {
          method: "DELETE",
        },
      });
      if (response.isOk) {
        set({
          organizations: get().organizations.filter((org) => org.id !== id),
        });
      }

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
          : "Failed to delete organization";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      organizations: [],
      isLoading: false,
      error: null,
      lastFetch: null,
    }),
}));
