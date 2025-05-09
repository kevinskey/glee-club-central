
import { useAuth } from '@/contexts/AuthContext';
import { PermissionName } from '@/types/permissions';

export function usePermissions() {
  const { permissions, isAdmin, profile } = useAuth();
  
  const hasPermission = (permission: PermissionName): boolean => {
    // Super admins have all permissions
    if (profile?.is_super_admin || isAdmin()) {
      return true;
    }
    
    // Check if the user has the specific permission
    return permissions ? permissions[permission] === true : false;
  };
  
  return {
    hasPermission,
    permissions,
    isSuperAdmin: !!profile?.is_super_admin
  };
}
