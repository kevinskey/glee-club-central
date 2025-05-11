
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PermissionName } from '@/types/permissions';

// Define user roles as a simple string literal type
export type UserRole = 'admin' | 'student' | 'section_leader' | 'staff' | 'guest';

// Simple permissions object with string keys and boolean values
type PermissionsObject = Record<string, boolean>;

// Define the context interface
interface RolePermissionContextType {
  userRole: UserRole | null;
  permissions: PermissionsObject;
  isLoading: boolean;
  hasPermission: (permissionName: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

// Create context with default value to avoid type checking issues
const RolePermissionContext = createContext<RolePermissionContextType>({
  userRole: null,
  permissions: {},
  isLoading: true,
  hasPermission: () => false,
  refreshPermissions: async () => {}
});

// Export the hook for consuming the context
export const useRolePermissions = () => useContext(RolePermissionContext);

// Provider component implementation
export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<PermissionsObject>({});
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch permissions from Supabase
  const fetchPermissions = async () => {
    if (!user) {
      setUserRole(null);
      setPermissions({});
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get role from profile
      const roleFromProfile = profile?.role || 'student';
      
      // Define valid roles using a simple array
      const validRoles = ['admin', 'student', 'section_leader', 'staff', 'guest'];
      
      // Simple role assignment with manual validation
      let role: UserRole;
      
      if (validRoles.includes(roleFromProfile as string)) {
        // Only set as UserRole if it's in our validRoles array
        role = roleFromProfile as UserRole;
      } else {
        // Default fallback
        role = 'student';
      }
      
      // Set role directly
      setUserRole(role);

      // Fetch permissions based on role
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission, granted')
        .eq('role', role);

      if (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Failed to load user permissions');
        return;
      }

      // Create permissions object directly
      const permissionsMap: PermissionsObject = {};
      if (data) {
        data.forEach((item) => {
          permissionsMap[item.permission] = item.granted;
        });
      }

      setPermissions(permissionsMap);
    } catch (err) {
      console.error('Unexpected error loading permissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch permissions when user or profile changes
  useEffect(() => {
    fetchPermissions();
  }, [user, profile]);

  // Function to check if a user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    // Super admins have all permissions
    if (profile?.is_super_admin) return true;
    
    // Admin role has all permissions
    if (userRole === 'admin') return true;
    
    // Check specific permission
    return permissions[permissionName] === true;
  };

  // Return context provider with values
  return (
    <RolePermissionContext.Provider
      value={{
        userRole,
        permissions,
        isLoading,
        hasPermission,
        refreshPermissions: fetchPermissions
      }}
    >
      {children}
    </RolePermissionContext.Provider>
  );
};
