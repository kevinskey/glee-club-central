
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
  const { user, profile, isLoading, isAuthenticated } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  // For development purposes - enable this for easier testing
  const isDevelopmentMode = true; // Set to true during development, false for production
  
  // Debug info (add console logging for troubleshooting)
  console.log('AdminRoute check:', {
    isLoading,
    isAuthenticated,
    email: user?.email,
    role: profile?.role,
    isSuperAdmin: isSuperAdmin,
    is_super_admin_flag: profile?.is_super_admin,
    title: profile?.title
  });
  
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
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // DEVELOPMENT MODE: Allow all authenticated users access in development mode
  if (isDevelopmentMode) {
    console.log('Development mode active: Granting admin access to all authenticated users');
    return <>{children}</>;
  }
  
  // PRODUCTION CHECKS - Check for admin access
  // This includes users with admin roles, super admins, or specific permissions
  const hasAdminAccess = 
    (profile?.role === 'admin' || profile?.role === 'administrator' || profile?.role === 'director') || 
    isSuperAdmin || 
    profile?.is_super_admin === true ||
    profile?.title === 'Super Admin' ||
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
