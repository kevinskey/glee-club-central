
import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading, isAuthenticated, isAdmin } = useAuth();
  
  // For development purposes - enable this for easier testing
  const isDevelopmentMode = true; // Set to true during development, false for production
  
  // Debug info (add console logging for troubleshooting)
  console.log('AdminRoute check:', {
    isLoading,
    isAuthenticated,
    email: user?.email,
    isSuperAdmin: profile?.is_super_admin
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
  // This includes super admin users
  const hasAdminAccess = isAdmin() || profile?.is_super_admin === true;
  
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

// Add a default export for backward compatibility
export default AdminRoute;
