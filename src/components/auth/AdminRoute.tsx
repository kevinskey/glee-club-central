
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  
  const isLoading = authLoading || permissionsLoading;
  
  // Debug logging
  console.log('AdminRoute check:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    userRole: profile?.role,
    isSuperAdmin,
    profileIsSuperAdmin: profile?.is_super_admin,
    isAdmin: isAdmin ? isAdmin() : false
  });
  
  // Show loading state while checking admin status
  if (isLoading) {
    console.log('AdminRoute: Still loading auth/permissions');
    return (
      <PageLoader 
        message="Verifying admin access..." 
        className="min-h-screen"
      />
    );
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated || !user) {
    console.log('AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Wait for profile to load before checking admin status
  if (!profile) {
    console.log('AdminRoute: Profile not loaded, showing loader');
    return (
      <PageLoader 
        message="Loading user profile..." 
        className="min-h-screen"
      />
    );
  }
  
  // Check for admin access - include multiple sources
  const hasAdminAccess = isSuperAdmin || 
                        profile?.is_super_admin === true || 
                        profile?.role === 'admin' ||
                        (isAdmin && isAdmin());
  
  console.log('AdminRoute: Admin access check result:', hasAdminAccess);
  
  // Redirect non-admin users to the member dashboard
  if (!hasAdminAccess) {
    console.log('AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // Render children for users with admin access
  console.log('AdminRoute: User has admin access, displaying admin content');
  return <>{children}</>;
};

// Add a default export for backward compatibility
export default AdminRoute;
