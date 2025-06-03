
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
  
  // Wait for initialization to complete
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Starting up..." 
        className="min-h-screen"
      />
    );
  }
  
  // If still loading after initialization, show brief loader
  if (isLoading && !user) {
    return (
      <PageLoader 
        message="Checking authentication..." 
        className="min-h-screen"
      />
    );
  }
  
  // Check authentication
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access - prioritize known admin email
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  const hasAdminAccess = isKnownAdmin || isAdmin();
  
  console.log('🔍 AdminRoute: Final admin access check:', {
    userEmail: user?.email,
    isKnownAdmin,
    hasAdminAccess,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin
  });
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('✅ AdminRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminRoute;
