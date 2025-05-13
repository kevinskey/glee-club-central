
import { useAuth } from "@/contexts/AuthContext";

/**
 * A simplified hook for checking user permissions based on admin status
 */
export const usePermissions = () => {
  const { isAdmin, profile, user } = useAuth();

  // Check if user is super admin
  const isSuperAdmin = profile?.is_super_admin || false;
  
  // Check if user has admin role
  const isAdminRole = isAdmin ? isAdmin() : false;

  // Simple permission check function that allows any authenticated user for basic actions
  const hasPermission = (permission: string): boolean => {
    // If no user is logged in, they have no permissions
    if (!user) return false;
    
    // Super admins have all permissions
    if (isSuperAdmin) return true;
    
    // Admin users have all permissions
    if (isAdminRole) return true;
    
    // Special case permissions for regular users
    if (permission === 'can_upload_media') {
      // Allow any authenticated user to upload media
      return true;
    }
    
    // For other permissions, default to false for regular users
    return false;
  };

  return {
    hasPermission,
    isSuperAdmin,
    isAdminRole,
    isLoggedIn: !!user
  };
};
