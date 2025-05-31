
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
  
  // Set a reasonable timeout for loading
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 2000); // Reduced timeout to prevent infinite loading
    
    return () => clearTimeout(timer);
  }, []);
  
  const isLoading = authLoading && !loadingTimeout;
  
  // Enhanced admin detection
  const hasAdminAccess = React.useMemo(() => {
    // Primary check: profile-based admin status
    if (isSuperAdmin || profile?.is_super_admin === true || profile?.role === 'admin') {
      return true;
    }
    
    // Secondary check: isAdmin function (includes metadata fallback)
    if (isAdmin && isAdmin()) {
      return true;
    }
    
    return false;
  }, [isSuperAdmin, profile, isAdmin]);
  
  console.log('AdminRoute check:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    userRole: profile?.role,
    isSuperAdmin,
    profileIsSuperAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin ? isAdmin() : false,
    hasAdminAccess,
    loadingTimeout
  });
  
  // Show loading state briefly
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
  
  // Redirect non-admin users
  if (!hasAdminAccess) {
    console.log('AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // Render children for users with admin access
  console.log('AdminRoute: Allowing access to admin content');
  return <>{children}</>;
};

export default AdminRoute;
