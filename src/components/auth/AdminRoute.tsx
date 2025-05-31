
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
  
  const isLoading = authLoading;
  
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
  
  // If profile is still loading, show loader (but don't wait forever)
  if (!profile && authLoading) {
    console.log('AdminRoute: Profile not loaded, showing loader');
    return (
      <PageLoader 
        message="Loading user profile..." 
        className="min-h-screen"
      />
    );
  }
  
  // Check for admin access - be more permissive if profile hasn't loaded
  const hasAdminAccess = isSuperAdmin || 
                        profile?.is_super_admin === true || 
                        profile?.role === 'admin' ||
                        (isAdmin && isAdmin());
  
  console.log('AdminRoute: Admin access check result:', hasAdminAccess);
  
  // Only redirect non-admin users if we have profile data to verify
  if (!hasAdminAccess && profile) {
    console.log('AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // If we don't have profile data yet but user is authenticated, show loading
  if (!profile) {
    return (
      <PageLoader 
        message="Verifying admin permissions..." 
        className="min-h-screen"
      />
    );
  }
  
  // Render children for users with admin access
  console.log('AdminRoute: User has admin access, displaying admin content');
  return <>{children}</>;
};

export default AdminRoute;
