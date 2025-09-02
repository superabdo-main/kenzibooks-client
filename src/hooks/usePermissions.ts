import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useUsersStore } from "@/stores/users.store";
import { UserPermission, UserWithPermissions } from "@/types/user-permission";
import { useMemo } from "react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";

export function usePermissions() {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const orgInfo = useManagementStore((state) => state.managedOrganization);
  
  // Get current user permissions
  const { data: userWithPermissions } = useSWR<UserWithPermissions>(
    session?.accessToken && organizationId && session?.user?.id
      ? `/user/permissions/${organizationId}/${session.user.id}`
      : null,
    session?.accessToken ? swrAuthenticatedFetcher(session.accessToken) : null
  );

  // Determine if current user is the org owner
  const isOrgOwner = useMemo(() => {
    return orgInfo?.isOwner
    // return false;
  }, [orgInfo, session]);

  // Get the permissions array for the current user
  const permissions = useMemo(() => {
    if (!userWithPermissions) return [];
    return userWithPermissions.permissions || [];
  }, [userWithPermissions]);

  // Check if a user has permission for a specific feature and action
  const hasPermission = (feature: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    // Org owner always has all permissions
    // console.log(isOrgOwner);
    if (isOrgOwner) return true;

    // Find the permission for this feature
    const permission = permissions.find(p => p.feature === feature);
    if (!permission) return false;

    // Check the specific action
    switch (action) {
      case 'view':
        return permission.canView;
      case 'create':
        return permission.canCreate;
      case 'edit':
        return permission.canEdit;
      case 'delete':
        return permission.canDelete;
      default:
        return false;
    }
  };

  return {
    hasPermission,
    isOrgOwner,
    permissions,
    isLoading: !userWithPermissions && !!session?.accessToken && !!organizationId,
  };
} 