
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading, isAuthenticated, profile } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for admin access - now includes users with admin permissions too
  const hasAdminAccess = 
    isAdmin() || 
    isSuperAdmin || 
    hasPermission('can_manage_users') ||
    hasPermission('can_post_announcements') ||
    hasPermission('can_manage_archives') ||
    hasPermission('can_edit_financials');
  
  // Redirect non-admin users to the dashboard
  if (!hasAdminAccess) {
    console.log('User does not have admin access, redirecting to dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render children for users with admin access
  console.log('User has admin access, displaying admin content');
  return <>{children}</>;
};
