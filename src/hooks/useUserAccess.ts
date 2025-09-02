import { useAuth } from '@/contexts/AuthContext';

type AccessAction = 'view' | 'create' | 'edit' | 'delete';

export const useUserAccess = () => {
  const { hasPermission, isOrgOwner, permissionsLoading } = useAuth();

  const checkAccess = (feature: string, action: AccessAction) => {
    return hasPermission(feature, action);
  };

  // Convenience methods for common actions
  const canView = (feature: string) => checkAccess(feature, 'view');
  const canCreate = (feature: string) => checkAccess(feature, 'create');
  const canEdit = (feature: string) => checkAccess(feature, 'edit');
  const canDelete = (feature: string) => checkAccess(feature, 'delete');

  return {
    checkAccess,
    canView,
    canCreate,
    canEdit, 
    canDelete,
    isOrgOwner,
    isLoading: permissionsLoading
  };
}; 