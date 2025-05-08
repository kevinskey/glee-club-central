
import { useAuth } from "@/contexts/AuthContext";
import { getUserPermissions, PermissionSet } from "@/utils/supabase/user/types";

export function usePermissions() {
  const { user, userProfile } = useAuth();
  
  // Default permissions (no access)
  const defaultPermissions: PermissionSet = {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: false,
    canUploadMusic: false,
    canEditCalendar: false,
    canTakeAttendance: false,
    canManagePayments: false,
    canEditOwnProfile: false,
    canViewMemberDetails: false,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  };

  // Get permissions based on user role
  const permissions = userProfile ? getUserPermissions(userProfile.role) : defaultPermissions;

  // Check if the current user can edit a specific user
  const canEditUser = (userId: string): boolean => {
    // Admin can edit anyone
    if (permissions.canEditUsers) return true;
    
    // Users can edit their own profile if they have permission
    if (permissions.canEditOwnProfile && user?.id === userId) return true;
    
    return false;
  };

  // Check if the current user can view a specific user's details
  const canViewUserDetails = (userId: string): boolean => {
    // Admins and those with permission can view all users
    if (permissions.canViewMemberDetails) return true;
    
    // Users can always view their own profile
    if (user?.id === userId) return true;
    
    return false;
  };

  return {
    ...permissions,
    canEditUser,
    canViewUserDetails,
    isLoggedIn: !!user
  };
}
