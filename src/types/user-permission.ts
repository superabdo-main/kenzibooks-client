export type UserPermission = {
  id: string;
  userId: string;
  organizationId: string;
  feature: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserWithPermissions = {
  id: string;
  uuid: string;
  email: string;
  username: string;
  phone?: string;
  permissions: UserPermission[];
};

export type CreateUserPermissionDto = {
  email: string;
  organizationId: string;
  permissions: {
    feature: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
};

export type UpdateUserPermissionDto = {
  userId: string;
  organizationId: string;
  permissions: {
    feature: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
};

export const AVAILABLE_FEATURES = [
  'products',
  'categories',
  'warehouses',
  'purchases',
  'suppliers',
  'customers',
  'sales',
  'expenses',
  'employees',
  'payrolls',
  'taxes',
  'charts',
  'fixed-assets',
]; 