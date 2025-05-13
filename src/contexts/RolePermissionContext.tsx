
import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Define context type
interface RolePermissionContextType {
  hasPermission: (permission: string) => boolean;
  userRole: string;
  isLoading: boolean;
}

// Create context with defaults
const RolePermissionContext = createContext<RolePermissionContextType>({
  hasPermission: () => false,
  userRole: "member",
  isLoading: true,
});

// Provider component
export const RolePermissionProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isLoading, profile } = useAuth();
  
  // Determine user role based on admin status
  const userRole = profile?.is_super_admin ? "admin" : "member";
  
  // Simple permission check function
  const hasPermission = (permission: string): boolean => {
    return profile?.is_super_admin || (isAdmin ? isAdmin() : false);
  };

  const value = {
    hasPermission,
    userRole,
    isLoading,
  };

  return (
    <RolePermissionContext.Provider value={value}>
      {children}
    </RolePermissionContext.Provider>
  );
};

// Custom hook for using this context
export const useRolePermissions = () => useContext(RolePermissionContext);
