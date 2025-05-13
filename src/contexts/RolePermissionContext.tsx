
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PermissionsState {
  isLoading: boolean;
  error: string | null;
  permissions: Record<string, boolean> | null;
  refreshPermissions: () => Promise<void>;
  userRole: string | null;
  hasPermission: (permissionName: string) => boolean;
}

const RolePermissionContext = createContext<PermissionsState>({
  isLoading: true,
  error: null,
  permissions: null,
  refreshPermissions: async () => {},
  userRole: null,
  hasPermission: () => false,
});

export const useRolePermissions = () => useContext(RolePermissionContext);

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean> | null>(null);
  const { user, profile } = useAuth();

  // Function to check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    // If user has no permissions loaded or if permissions is null, deny access
    if (!permissions) return false;
    
    // If user is a super admin, grant all permissions
    if (profile?.is_super_admin) return true;
    
    // If user has an admin-like role, grant all permissions
    if (profile?.role === 'admin' || 
        profile?.role === 'administrator' || 
        profile?.role === 'director') {
      return true;
    }
    
    // Otherwise, check if the specific permission is granted
    return permissions[permissionName] === true;
  };

  const loadPermissions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.id) {
        console.log("No user ID available, skipping permission loading");
        setPermissions(null);
        setIsLoading(false);
        return;
      }
      
      console.log("Loading permissions for user:", user.id);
      
      // Use the new dynamic function to get permissions
      const { data, error } = await supabase
        .rpc('get_user_permissions_dynamic', {
          p_user_id: user.id
        });
      
      if (error) {
        console.error("Error loading permissions:", error);
        setError("Failed to load permissions");
        
        // Fall back to the old method if the new function fails
        const oldPermissions = await fetchLegacyPermissions(user.id);
        setPermissions(oldPermissions || {});
        return;
      }
      
      console.log("Loaded dynamic permissions:", data);
      
      if (data) {
        // Convert array of permission objects to a simple map
        const permissionsMap: Record<string, boolean> = {};
        
        data.forEach((item: { permission: string; granted: boolean }) => {
          permissionsMap[item.permission] = item.granted;
        });
        
        setPermissions(permissionsMap);
      } else {
        setPermissions({});
      }
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError("Failed to load permissions");
      setPermissions({});
    } finally {
      setIsLoading(false);
    }
  };
  
  // Legacy permission loading function as fallback
  const fetchLegacyPermissions = async (userId: string) => {
    try {
      // Use the old function to get permissions
      const { data, error } = await supabase.rpc('get_user_permissions', {
        p_user_id: userId
      });

      if (error) {
        console.error("Error fetching legacy permissions:", error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn("No legacy permissions returned");
        return {};
      }

      // Convert array of permission objects to a simple map
      const permissionsMap: Record<string, boolean> = {};
      
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item && typeof item === 'object' && 'permission' in item && 'granted' in item) {
            permissionsMap[item.permission] = item.granted;
          } else if (typeof item === 'string') {
            permissionsMap[item] = true;
          }
        });
      }

      console.log("Legacy permissions loaded:", Object.keys(permissionsMap).length);
      return permissionsMap;
    } catch (error) {
      console.error("Error in legacy permissions:", error);
      return {};
    }
  };

  // Load permissions when the user object changes
  useEffect(() => {
    if (user?.id) {
      loadPermissions();
    } else {
      setPermissions(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  // Reload permissions when profile role or title changes
  useEffect(() => {
    if (user?.id && (profile?.role || profile?.title)) {
      loadPermissions();
    }
  }, [profile?.role, profile?.title]);

  const refreshPermissions = async () => {
    if (user?.id) {
      console.log('Refreshing permissions for user:', user.id);
      await loadPermissions();
    }
  };

  // Get the user's role from their profile
  const userRole = profile?.role || null;

  return (
    <RolePermissionContext.Provider
      value={{ 
        isLoading, 
        error, 
        permissions, 
        refreshPermissions,
        userRole,
        hasPermission 
      }}
    >
      {children}
    </RolePermissionContext.Provider>
  );
};
