
import React from "react";
import { Navigate } from "react-router-dom";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, isAdmin, isAuthenticated } = useSimpleAuthContext();
  
  console.log('🛡️ AdminRoute: Admin access check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin(),
    isAuthenticated,
    isLoading,
    isInitialized
  });
  
  // Show loading state while auth and profile are loading
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Verifying admin access..." 
        className="min-h-screen"
      />
    );
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Wait for profile to load before making admin decisions
  if (!profile) {
    return (
      <PageLoader 
        message="Loading profile data..." 
        className="min-h-screen"
      />
    );
  }
  
  // Check admin access
  const hasAdminAccess = isAdmin();
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // Render children for users with admin access
  console.log('✅ AdminRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminRoute;
