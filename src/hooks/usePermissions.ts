
import { useAuth } from "@/contexts/AuthContext";
import { useRolePermissions } from "@/contexts/RolePermissionContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function usePermissions() {
  const { user, profile, isAdmin } = useAuth();
  const { hasPermission: roleHasPermission, userRole } = useRolePermissions();
  const [permissions, setPermissions] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  const isLoggedIn = !!user;
  
  // Check if user is a super admin
  const isSuperAdmin = profile?.is_super_admin || false;
  
  // Check if user has admin role (for backward compatibility)
  const isAdminRole = userRole === 'admin' || userRole === 'Admin';

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) {
        setPermissions({});
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_permissions', {
          p_user_id: user.id
        });

        if (error) throw error;

        // Convert array of permission objects to a map
        const permissionsMap: {[key: string]: boolean} = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            permissionsMap[item.permission] = item.granted;
          });
        }

        setPermissions(permissionsMap);
      } catch (err) {
        console.error('Error loading permissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  // Core permission check function that combines all permission sources
  const hasPermission = (permission: string): boolean => {
    // Always allow super admins
    if (isSuperAdmin) return true;
    
    // Check traditional admin role
    if (isAdmin && isAdmin()) return true;
    
    // Check role-based permissions
    if (roleHasPermission(permission)) return true;
    
    // Check direct permissions from database
    return !!permissions[permission];
  };

  return {
    isLoggedIn,
    isSuperAdmin,
    isAdminRole,
    isLoading,
    hasPermission,
    permissions
  };
}
