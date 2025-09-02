import { useAuth } from "@/contexts/AuthContext";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { useManagementStore } from "@/stores/management.store";
import { useUsersStore } from "@/stores/users.store";
import { useEffect } from "react";
import useSWR from "swr";

export function useUsers() {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  // const { users, isLoading, fetchUsers, error } = useUsersStore();

  const {
    data,
    mutate,
    isLoading,
    error
  } = useSWR(
    session?.accessToken ? `/user/org-users/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null
  );

  return {
    users: data || [],
    isLoading: isLoading,
    isError: !!error,
    mutate,
  };
}
