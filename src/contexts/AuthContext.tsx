// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useManagementStore } from '@/stores/management.store';
import { UserPermission, UserWithPermissions } from '@/types/user-permission';
import { swrAuthenticatedFetcher } from '@/lib/swrFetcher';
import useSWR from 'swr';

type AuthContextType = {
  session: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isOrgOwner: boolean;
  hasPermission: (feature: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  permissionsLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Organization {
  id: string;
  name: string;
  [key: string]: any;
}

interface PermissionsResponse {
  data: UserWithPermissions;
  [key: string]: any;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isOrgOwner, setIsOrgOwner] = useState(false);
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const orgInfo = useManagementStore((state) => state.managedOrganization as Organization | undefined);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  // Get current user permissions
  const { data: userWithPermissions, isLoading: permissionsLoading } = useSWR<PermissionsResponse | undefined>(
    session?.accessToken && organizationId && session?.user?.id
      ? `/user/permissions/${organizationId}/${session.user.id}`
      : null,
    session?.accessToken ? swrAuthenticatedFetcher(session.accessToken) : null
  );
  // console.log(userWithPermissions)

  useEffect(() => {
    // Check if current user is the org owner
    if (session?.user?.id && orgInfo) {
      setIsOrgOwner(orgInfo.isOwner);
      // setIsOrgOwner(false);
    } else {
      setIsOrgOwner(false);
    }
  }, [session, orgInfo]);

  useEffect(() => {
    // Set permissions from API response
    if (userWithPermissions?.permissions) {
      setPermissions(userWithPermissions.permissions);
    } else {
      setPermissions([]);
    }
  }, [userWithPermissions]);

  // Permission check function
  const hasPermission = (feature: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    // Org owner always has all permissions
    if (isOrgOwner) return true;

    // Find the permission for this feature
    const permission = permissions.find(p => p.feature === feature);
    // console.log(permissions, permission, feature, action)
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

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        status, 
        isOrgOwner, 
        hasPermission, 
        permissionsLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};