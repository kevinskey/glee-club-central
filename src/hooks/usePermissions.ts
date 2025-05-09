
import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { permissions, profile } = useAuth();

  // Get permission by name
  const hasPermission = (permissionName: string): boolean => {
    if (!permissions) return false;
    return permissions[permissionName] === true;
  };
  
  // Check if the user is a super admin
  const isSuperAdmin = !!profile?.is_super_admin;
  
  return {
    hasPermission,
    isSuperAdmin
  };
}
