
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { hasPermission as checkPermission } from '@/utils/permissionChecker';

interface RolePermissionContextType {
  userRole: string | null;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const RolePermissionContext = createContext<RolePermissionContextType | undefined>(undefined);

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAuthenticated, isInitialized } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only set loading to false once we're initialized and have resolved auth state
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const userRole = profile?.role || 'member';

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Super admins have all permissions
    if (profile?.is_super_admin || profile?.role === 'admin') {
      return true;
    }
    
    // Create user object for permission checking
    const currentUser = {
      ...user,
      role: profile?.role,
      role_tags: profile?.role_tags || []
    };
    
    // Use the updated permission checker
    return checkPermission(currentUser, permission);
  };

  const contextValue: RolePermissionContextType = {
    userRole,
    hasPermission,
    isLoading,
  };

  return (
    <RolePermissionContext.Provider value={contextValue}>
      {children}
    </RolePermissionContext.Provider>
  );
};

export const useRolePermissions = () => {
  const context = useContext(RolePermissionContext);
  if (context === undefined) {
    throw new Error('useRolePermissions must be used within a RolePermissionProvider');
  }
  return context;
};
