
import { useAuth } from "@/contexts/AuthContext";

/**
 * A simplified hook for checking user permissions based on admin status
 */
export const usePermissions = () => {
  const { isAdmin, profile } = useAuth();

  // Check if user is super admin
  const isSuperAdmin = profile?.is_super_admin || false;
  
  // Check if user has admin role
  const isAdminRole = isAdmin ? isAdmin() : false;

  // Simple permission check function that only checks if user is an admin
  const hasPermission = (permission: string): boolean => {
    return isSuperAdmin || isAdminRole;
  };

  return {
    hasPermission,
    isSuperAdmin,
    isAdminRole,
  };
};
