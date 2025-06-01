
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

export const usePermissions = () => {
  const { user, profile, isAdmin } = useSimpleAuthContext();

  const hasPermission = (permission: string): boolean => {
    // Basic permissions for authenticated users
    const basicPermissions = {
      'view_sheet_music': true,
      'view_calendar': true,
      'view_announcements': true,
      'admin_access': isAdmin()
    };
    
    return basicPermissions[permission] || false;
  };

  return {
    profile,
    permissions: {},
    hasPermission,
    isAdmin,
    user
  };
};
