
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, isAdmin } = useAuth();

  console.log('🛡️ AdminRoute: Access check:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    isAuthenticated,
    isAdmin: isAdmin(),
    isLoading,
    isInitialized
  });

  // Show loader during initialization
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Loading..." 
        className="min-h-screen"
      />
    );
  }

  // Check authentication first
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Show loader while checking admin status (brief)
  if (isLoading && !profile) {
    return (
      <PageLoader 
        message="Checking permissions..." 
        className="min-h-screen"
      />
    );
  }

  // Check admin access
  if (!isAdmin()) {
    console.log('🚫 AdminRoute: User does not have admin access');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ AdminRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminRoute;
