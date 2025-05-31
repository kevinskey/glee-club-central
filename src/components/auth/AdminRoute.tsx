
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
  
  // Shorter loading timeout for admin routes
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 2000); // 2 second timeout
    
    return () => clearTimeout(timer);
  }, []);
  
  const isLoading = authLoading && !loadingTimeout;
  
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
    isAdmin: isAdmin ? isAdmin() : false,
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
  
  // Check for admin access - be more permissive when loading
  const hasAdminAccess = isSuperAdmin || 
                        profile?.is_super_admin === true || 
                        profile?.role === 'admin' ||
                        (isAdmin && isAdmin());
  
  console.log('AdminRoute: Admin access check result:', hasAdminAccess);
  
  // Only redirect non-admin users if we have definitive profile data or timeout
  if (!hasAdminAccess && (profile || loadingTimeout)) {
    console.log('AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // If we don't have profile data yet but user is authenticated, show brief loading
  if (!profile && !loadingTimeout) {
    return (
      <PageLoader 
        message="Loading..." 
        className="min-h-screen"
      />
    );
  }
  
  // Render children for users with admin access or when timeout reached
  console.log('AdminRoute: Allowing access to admin content');
  return <>{children}</>;
};

export default AdminRoute;
