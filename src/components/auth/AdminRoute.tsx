
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, isAdmin, isAuthenticated } = useAuth();
  
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
  
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Verifying admin access..." 
        className="min-h-screen"
      />
    );
  }
  
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (!profile) {
    return (
      <PageLoader 
        message="Loading user profile..." 
        className="min-h-screen"
      />
    );
  }
  
  const hasAdminAccess = isAdmin();
  
  console.log('🔍 AdminRoute: Final admin access check:', {
    userEmail: user?.email,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    hasAdminAccess,
    isKnownAdmin: user?.email === 'kevinskey@mac.com'
  });
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  console.log('✅ AdminRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminRoute;
