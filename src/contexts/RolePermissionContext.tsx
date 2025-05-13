
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserPermissions } from '@/utils/supabase/permissions';

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
      const userPermissions = await fetchUserPermissions(user.id);
      console.log("Loaded permissions:", userPermissions);
      
      setPermissions(userPermissions || {});
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError("Failed to load permissions");
    } finally {
      setIsLoading(false);
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

  // Reload permissions when profile role changes
  useEffect(() => {
    if (user?.id && profile?.role) {
      loadPermissions();
    }
  }, [profile?.role]);

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
