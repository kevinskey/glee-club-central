
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
  const { user, profile, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  
  const isLoading = authLoading || permissionsLoading;
  
  // Debug info for troubleshooting
  console.log('AdminRoute check:', {
    isLoading,
    isAuthenticated,
    email: user?.email,
    isSuperAdmin,
    profileIsSuperAdmin: profile?.is_super_admin,
    isAdmin: isAdmin ? isAdmin() : false
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
  
  // Check for admin access - include multiple sources
  const hasAdminAccess = isSuperAdmin || 
                        profile?.is_super_admin === true || 
                        (isAdmin && isAdmin());
  
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
