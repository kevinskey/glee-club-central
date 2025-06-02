
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission as checkPermission } from '@/utils/permissionChecker';

export const usePermissions = () => {
  const { user, profile, isAdmin } = useAuth();

  // Create user object for permission checking
  const currentUser = {
    ...user,
    role: profile?.role,
    role_tags: profile?.role_tags || []
  };

  const hasPermission = (permission: string): boolean => {
    // Use the updated permission checker
    return checkPermission(currentUser, permission);
  };

  const permissions = {
    'view_sheet_music': hasPermission('view_sheet_music'),
    'view_calendar': hasPermission('view_calendar'),
    'view_announcements': hasPermission('view_announcements'),
    'admin_access': isAdmin()
  };

  return {
    profile,
    permissions,
    hasPermission,
    isAdmin,
    user
  };
};
