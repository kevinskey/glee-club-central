
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
    if (!isAuthenticated || !profile) return false;
    
    // Super admins have all permissions
    if (profile.is_super_admin || profile.role === 'admin') {
      return true;
    }
    
    // Basic permissions for all authenticated users
    const basicPermissions = ['view_calendar', 'view_announcements', 'view_sheet_music'];
    if (basicPermissions.includes(permission)) {
      return true;
    }
    
    return false;
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
