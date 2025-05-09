import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { permissions, profile, isAdmin } = useAuth();

  // Get permission by name
  const hasPermission = (permissionName: string): boolean => {
    // Super admins and admins have all permissions
    if (profile?.is_super_admin || isAdmin()) return true;
    
    // Otherwise check specific permissions
    if (!permissions) return false;
    return permissions[permissionName] === true;
  };
  
  // Check if the user is a super admin
  const isSuperAdmin = Boolean(profile?.is_super_admin);
  
  // Log permissions for debugging
  console.log('usePermissions hook:', {
    isSuperAdmin,
    isAdmin: isAdmin ? isAdmin() : false,
    profileSuperAdmin: profile?.is_super_admin,
    permissions
  });
  
  return {
    hasPermission,
    isSuperAdmin
  };
}
