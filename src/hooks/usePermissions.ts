
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const { profile, permissions, isAdmin } = useProfile();

  const hasPermission = (permission: string): boolean => {
    return permissions[permission] || false;
  };

  return {
    profile,
    permissions,
    hasPermission,
    isAdmin,
    user
  };
};
