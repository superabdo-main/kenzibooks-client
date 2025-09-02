import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";
import { UserWithPermissions, CreateUserPermissionDto, UpdateUserPermissionDto } from "@/types/user-permission";

type UsersState = {
  error: string | null;
  users: UserWithPermissions[];
  setUsers: (users: UserWithPermissions[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  fetchUsers: ({
    accessToken,
    organizationId,
  }: {
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<UserWithPermissions[]>>;
  findUserByEmail: ({
    email,
    accessToken,
  }: {
    email: string;
    accessToken: string;
  }) => Promise<ApiResponse<{ exists: boolean; user: UserWithPermissions | null }>>;
  getUserWithPermissions: ({
    userId,
    accessToken,
    organizationId,
  }: {
    userId: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse<UserWithPermissions>>;
  createUserPermissions: ({
    data,
    accessToken,
  }: {
    data: CreateUserPermissionDto;
    accessToken: string;
  }) => Promise<ApiResponse>;
  updateUserPermissions: ({
    data,
    accessToken,
  }: {
    data: UpdateUserPermissionDto;
    accessToken: string;
  }) => Promise<ApiResponse>;
  deleteUserFromOrganization: ({
    userId,
    accessToken,
    organizationId,
  }: {
    userId: string;
    accessToken: string;
    organizationId: string;
  }) => Promise<ApiResponse>;
};

export const useUsersStore = create<UsersState>((set) => ({
  error: null,
  users: [],
  setUsers: (users) => set(() => ({ users })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  
  fetchUsers: async ({
    accessToken,
    organizationId,
  }: {
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch<UserWithPermissions[]>({
        accessToken,
        endpoint: `/user/org-users/${organizationId}`,
      });
      
      if (response.data) {
        set({
          users: response.data,
          isLoading: false,
        });
      } else if (response.error) {
        set({
          error: response.error,
          isLoading: false,
        });
      }
      
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  findUserByEmail: async ({
    email,
    accessToken,
  }: {
    email: string;
    accessToken: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch<{ exists: boolean; user: UserWithPermissions | null }>({
        accessToken,
        endpoint: `/user/find-by-email?email=${encodeURIComponent(email)}`,
      });
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to find user";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  getUserWithPermissions: async ({
    userId,
    accessToken,
    organizationId,
  }: {
    userId: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch<UserWithPermissions>({
        accessToken,
        endpoint: `/user/permissions/${organizationId}/${userId}`,
      });
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get user permissions";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  createUserPermissions: async ({
    data,
    accessToken,
  }: {
    data: CreateUserPermissionDto;
    accessToken: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/user/permissions`,
        options: {
          method: "POST",
          body: JSON.stringify(data),
        },
      });
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user permissions";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  updateUserPermissions: async ({
    data,
    accessToken,
  }: {
    data: UpdateUserPermissionDto;
    accessToken: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/user/permissions`,
        options: {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      });
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user permissions";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  deleteUserFromOrganization: async ({
    userId,
    accessToken,
    organizationId,
  }: {
    userId: string;
    accessToken: string;
    organizationId: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/user/org/${organizationId}/${userId}`,
        options: {
          method: "DELETE",
        },
      });
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove user from organization";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
})); 