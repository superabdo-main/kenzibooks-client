'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../shadcn-ui/skeleton';
import NoPermission from './NoPermission';

interface PermissionGuardProps extends PropsWithChildren {
  feature: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  fallback?: React.ReactNode;
  redirectOnViewDenied?: boolean;
}

export function PermissionGuard({
  children,
  feature,
  action,
  fallback,
  redirectOnViewDenied = true,
}: PermissionGuardProps) {
  const { hasPermission, isOrgOwner, isLoading } = usePermissions();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const permitted = hasPermission(feature, action);

  if (!permitted && action === 'view') {
    // If no view permission and redirectOnViewDenied is true, redirect to dashboard
    if (redirectOnViewDenied) {
      // router.push('/dashboard/access-denied');
      return <NoPermission/>
      // return null;
    }
    // Otherwise show the NoPermission component or custom fallback
    return fallback || <NoPermission />;
  }

  if (!permitted) {
    // For non-view permissions, show fallback or NoPermission
    return fallback || <NoPermission showBackButton={true} showHomeButton={false} />;
  }

  return <>{children}</>;
}

// Additional component for guarding UI elements without redirects
export function PermissionControl({
  children,
  feature,
  action,
  fallback,
}: Omit<PermissionGuardProps, 'redirectOnViewDenied'>) {
  const { hasPermission, isOrgOwner, isLoading } = usePermissions();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return null;
  }

  const permitted = hasPermission(feature, action);

  if (!permitted) {
    return fallback || null;
  }

  return <>{children}</>;
} 