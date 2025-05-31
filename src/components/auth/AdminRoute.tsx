
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
  const { user, profile, isLoading: authLoading, isAuthenticated, isAdmin, triggerAdminOverride } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  
  // Shorter loading timeout for admin routes
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000); // Increased to 3 seconds to allow for profile loading
    
    return () => clearTimeout(timer);
  }, []);
  
  const isLoading = authLoading && !loadingTimeout;
  
  // Enhanced admin detection with multiple fallbacks
  const hasAdminAccess = React.useMemo(() => {
    // Primary check: profile-based admin status
    if (isSuperAdmin || profile?.is_super_admin === true || profile?.role === 'admin') {
      return true;
    }
    
    // Secondary check: isAdmin function (includes metadata fallback)
    if (isAdmin && isAdmin()) {
      return true;
    }
    
    // Tertiary check: direct user metadata check (for when profile fails)
    if (user && !profile && loadingTimeout) {
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      if (userRole === 'admin' || userRole === 'super_admin') {
        console.log('AdminRoute: Admin access granted via user metadata');
        return true;
      }
    }
    
    return false;
  }, [isSuperAdmin, profile, isAdmin, user, loadingTimeout]);
  
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
    isAdminFunction: isAdmin ? isAdmin() : false,
    hasAdminAccess,
    loadingTimeout,
    userMetadataRole: user?.user_metadata?.role || user?.app_metadata?.role
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
  
  // Handle case where user is authenticated but no profile and should have admin access
  if (user && !profile && loadingTimeout) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    if (userRole === 'admin' || userRole === 'super_admin') {
      // Show override option for admin users with missing profiles
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Profile Loading Issue</h2>
            <p className="text-muted-foreground mb-6">
              Your admin profile couldn't be loaded, but you appear to have admin credentials. 
              You can activate admin override to proceed.
            </p>
            <button
              onClick={triggerAdminOverride}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Activate Admin Override
            </button>
          </div>
        </div>
      );
    }
  }
  
  console.log('AdminRoute: Final admin access check result:', hasAdminAccess);
  
  // Only redirect non-admin users if we have definitive data or timeout
  if (!hasAdminAccess && (profile || loadingTimeout)) {
    console.log('AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // If we don't have profile data yet but user is authenticated, show brief loading
  if (!profile && !loadingTimeout) {
    return (
      <PageLoader 
        message="Loading profile..." 
        className="min-h-screen"
      />
    );
  }
  
  // Render children for users with admin access or when timeout reached
  console.log('AdminRoute: Allowing access to admin content');
  return <>{children}</>;
};

export default AdminRoute;
