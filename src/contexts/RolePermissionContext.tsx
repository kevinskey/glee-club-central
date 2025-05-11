
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'student' | 'section_leader' | 'staff' | 'guest';

interface RolePermissionContextType {
  userRole: UserRole | null;
  permissions: Record<string, boolean>;
  isLoading: boolean;
  hasPermission: (permissionName: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const RolePermissionContext = createContext<RolePermissionContextType>({
  userRole: null,
  permissions: {},
  isLoading: true,
  hasPermission: () => false,
  refreshPermissions: async () => {}
});

export const useRolePermissions = () => useContext(RolePermissionContext);

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPermissions = async () => {
    if (!user) {
      setUserRole(null);
      setPermissions({});
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get role from profile and ensure it's a valid UserRole
      const roleFromProfile = profile?.role || 'student';
      
      // Cast the role to UserRole type after validation
      const role = (
        ['admin', 'student', 'section_leader', 'staff', 'guest'].includes(roleFromProfile) 
          ? roleFromProfile 
          : 'student'
      ) as UserRole;
      
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

      // Convert to permissions object
      const permissionsMap: Record<string, boolean> = {};
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

  useEffect(() => {
    fetchPermissions();
  }, [user, profile]);

  const hasPermission = (permissionName: string): boolean => {
    // Super admins have all permissions
    if (profile?.is_super_admin) return true;
    
    // Admin role has all permissions
    if (userRole === 'admin') return true;
    
    // Check specific permission
    return permissions[permissionName] === true;
  };

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
