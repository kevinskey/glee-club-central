
import { useAuth } from "@/contexts/AuthContext";
import { useRolePermissions } from "@/contexts/RolePermissionContext";
import { fetchUserPermissions, initializeUserPermissions } from "@/utils/supabase/permissions";
import { useState, useEffect, useCallback } from "react";

export function usePermissions() {
  const { user, profile, isAdmin } = useAuth();
  const { hasPermission: roleHasPermission, userRole } = useRolePermissions();
  const [permissions, setPermissions] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!user;
  
  // Check if user is a super admin
  const isSuperAdmin = profile?.is_super_admin || false;
  
  // Check if user has admin role (for backward compatibility)
  const isAdminRole = userRole === 'admin' || userRole === 'Admin';

  const loadPermissions = useCallback(async () => {
    if (!user) {
      setPermissions({});
      setIsLoading(false);
      setHasInitialized(true);
      return;
    }

    console.log('Loading permissions for user:', user.id);
    setIsLoading(true);

    try {
      // First try to fetch permissions
      let userPermissions = await fetchUserPermissions(user.id);
      
      // If no permissions found, try to initialize them
      if (Object.keys(userPermissions).length === 0 && !hasInitialized) {
        console.log('No permissions found, initializing...');
        const initialized = await initializeUserPermissions(user.id);
        
        if (initialized) {
          // Retry fetching after initialization
          userPermissions = await fetchUserPermissions(user.id);
          setHasInitialized(true);
        }
      }

      setPermissions(userPermissions);
      console.log('Permissions loaded:', userPermissions);
    } catch (err) {
      console.error('Error loading permissions:', err);
      // Set some default permissions as fallback
      setPermissions({
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, hasInitialized]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Core permission check function that combines all permission sources
  const hasPermission = useCallback((permission: string): boolean => {
    // Always allow super admins
    if (isSuperAdmin) {
      console.log('Permission granted for super admin:', permission);
      return true;
    }
    
    // Check traditional admin role
    if (isAdmin && isAdmin()) {
      console.log('Permission granted for admin:', permission);
      return true;
    }
    
    // Check role-based permissions
    if (roleHasPermission(permission)) {
      console.log('Permission granted via role:', permission);
      return true;
    }
    
    // Check direct permissions from database
    const hasDirectPermission = !!permissions[permission];
    console.log('Direct permission check for', permission, ':', hasDirectPermission);
    return hasDirectPermission;
  }, [isSuperAdmin, isAdmin, roleHasPermission, permissions]);

  return {
    isLoggedIn,
    isSuperAdmin,
    isAdminRole,
    isLoading,
    hasPermission,
    permissions,
    refreshPermissions: loadPermissions
  };
}
