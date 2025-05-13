
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { UserLevel } from '@/types/permissions';

type RolePermissionContextType = {
  userRole: string;
  userLevel: UserLevel;
  permissions: string[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  refreshPermissions: () => Promise<void>;
};

const RolePermissionContext = createContext<RolePermissionContextType | undefined>(undefined);

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [userRole, setUserRole] = useState<string>('member');
  const [userLevel, setUserLevel] = useState<UserLevel>('member');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPermissions = async () => {
    if (user?.id && isAuthenticated) {
      setIsLoading(true);
      try {
        // Fetch user permissions from Supabase
        const { permissions: userPermissions, title } = await fetchUserPermissions(user.id);
        
        // Set the permissions
        setPermissions(userPermissions || []);
        
        // Set user role based on title or other properties
        if (title) {
          setUserRole(title);
        }
        
        // Determine user level
        if (isAdmin()) {
          setUserLevel('admin');
        } else if (user.role === 'guest') {
          setUserLevel('guest');
        } else {
          setUserLevel('member');
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPermissions([]);
      setUserLevel('guest');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [user?.id, isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    // Admin users have all permissions
    if (isAdmin && isAdmin()) {
      return true;
    }
    
    // Check if the user has the specific permission
    return permissions.includes(permission);
  };

  const refreshPermissions = async () => {
    await loadPermissions();
  };

  return (
    <RolePermissionContext.Provider value={{
      userRole,
      userLevel,
      permissions,
      isLoading,
      hasPermission,
      refreshPermissions
    }}>
      {children}
    </RolePermissionContext.Provider>
  );
};

export const useRolePermissions = (): RolePermissionContextType => {
  const context = useContext(RolePermissionContext);
  
  if (context === undefined) {
    throw new Error('useRolePermissions must be used within a RolePermissionProvider');
  }
  
  return context;
};
