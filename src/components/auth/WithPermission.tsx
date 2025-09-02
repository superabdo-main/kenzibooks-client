'use client';

import { ReactElement } from 'react';
import { PermissionGuard } from './PermissionGuard';
import NoPermission from './NoPermission';

interface WithPermissionProps {
  feature: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  fallback?: ReactElement;
  redirectOnViewDenied?: boolean;
}

/**
 * Higher-Order Component that wraps a page component with permission checks
 * @param Component - The page component to be rendered if user has permission
 * @param options - Permission options (feature, action, fallback)
 * @returns A wrapped component with permission checks
 */
export function withPermission<P extends {}>(
  Component: React.ComponentType<P>,
  { feature, action, fallback, redirectOnViewDenied = true }: WithPermissionProps
): React.FC<P> {
  const WithPermissionComponent: React.FC<P> = (props) => {
    return (
      <PermissionGuard 
        feature={feature} 
        action={action} 
        fallback={fallback || <NoPermission />}
        redirectOnViewDenied={redirectOnViewDenied}
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };

  WithPermissionComponent.displayName = `WithPermission(${Component.displayName || Component.name || 'Component'})`;
  
  return WithPermissionComponent;
}

/**
 * Permission wrapper for action elements (buttons, links, etc.)
 * @param props - Properties including the element to render if permitted
 * @returns The element if permitted, null otherwise
 */
export function PermissionAction({ 
  feature, 
  action, 
  fallback = null,
  children 
}: WithPermissionProps & { children: ReactElement | ReactElement[] }) {
  return (
    <PermissionGuard feature={feature} action={action} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
} 