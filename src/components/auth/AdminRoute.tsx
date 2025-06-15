import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, isAuthenticated } = useAuth();
  
  console.log('🛡️ AdminRoute: Admin access check:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin(),
    isAuthenticated,
    isLoading,
    isInitialized
  });
  
  // Show loader during initialization
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Loading application..." 
        className="min-h-screen"
      />
    );
  }
  
  // Check authentication
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }
  
  // Wait for profile to load before checking admin status
  if (!profile) {
    return (
      <PageLoader 
        message="Loading profile..." 
        className="min-h-screen"
      />
    );
  }
  
  // Only allow admin if role is exactly 'admin'
  const hasAdminAccess = profile.role === 'admin';

  if (!hasAdminAccess) {
    console.log('🚫 AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('✅ AdminRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminRoute;
