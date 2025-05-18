
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect } from "react";

export const usePermissions = () => {
  const { profile, permissions, refreshPermissions } = useAuth();
  
  // Determine if the user has admin or super admin role
  const isAdminRole = profile?.role === 'admin';
  const isSuperAdmin = !!profile?.is_super_admin;
  const isUserRole = profile?.role === 'user';
  const isMemberRole = profile?.role === 'member';
  const isLoggedIn = !!profile; // Add this property to check if user is logged in
  
  // Check for a specific permission
  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      if (isSuperAdmin) return true;
      return !!permissions[permissionName];
    },
    [permissions, isSuperAdmin]
  );
  
  // Refresh permissions when profile changes
  useEffect(() => {
    if (profile && profile.id) {
      refreshPermissions();
    }
  }, [profile, refreshPermissions]);
  
  return {
    permissions,
    hasPermission,
    isAdminRole,
    isSuperAdmin,
    isUserRole,
    isMemberRole,
    isLoggedIn, // Return the isLoggedIn property
  };
};
