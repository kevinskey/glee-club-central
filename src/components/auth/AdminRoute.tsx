
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isAuthenticated, isInitialized, isAdmin } = useProfile();
  
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  const [showProfileWarning, setShowProfileWarning] = React.useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = React.useState(false);
  const [debugMode] = React.useState(true); // Enable debug mode temporarily
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
      
      // Show profile warning if user exists but no profile after timeout
      if (user && !profile) {
        setShowProfileWarning(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [user, profile]);
  
  const isLoading = (authLoading || !isInitialized) && !loadingTimeout;
  
  const hasAdminAccess = React.useMemo(() => {
    console.log('🛡️ AdminRoute: DETAILED ADMIN ACCESS CHECK:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileId: profile?.id,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin,
      profileStatus: profile?.status,
      isAdminFunction: isAdmin ? isAdmin() : false,
      authLoading,
      isInitialized,
      loadingTimeout,
      timestamp: new Date().toISOString()
    });

    // TEMPORARILY DISABLED: Allow access for debugging
    if (debugMode) {
      console.log('🚧 AdminRoute: DEBUG MODE - Allowing admin access for debugging');
      return true;
    }

    // Must have both user and profile loaded to make admin decision
    if (!user || !profile) {
      return false;
    }
    
    const adminAccess = profile?.is_super_admin === true || profile?.role === 'admin' || (isAdmin && isAdmin());
    
    console.log('🛡️ AdminRoute: Final admin access decision:', adminAccess);
    
    return adminAccess;
  }, [profile, isAdmin, user, authLoading, isInitialized, loadingTimeout, debugMode]);
  
  console.log('🛡️ AdminRoute: ROUTE DECISION CHECK:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    userRole: profile?.role,
    profileIsSuperAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin ? isAdmin() : false,
    hasAdminAccess,
    loadingTimeout,
    showProfileWarning,
    debugMode
  });
  
  // Show loading state while auth and profile are loading
  if (isLoading) {
    console.log('⏳ AdminRoute: Still loading auth/permissions/profile');
    return (
      <div>
        <PageLoader 
          message="Verifying admin access..." 
          className="min-h-screen"
        />
        {debugMode && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded text-xs">
            <div>🚧 ADMIN ROUTE DEBUG</div>
            <div>Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
            <div>Profile Initialized: {isInitialized ? 'Yes' : 'No'}</div>
            <div>User: {user?.email || 'None'}</div>
            <div>Profile: {profile?.role || 'None'}</div>
          </div>
        )}
      </div>
    );
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated || !user) {
    console.log('🚫 AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Wait for profile to load before making admin decisions (unless in debug mode)
  if (!profile && user && !debugMode) {
    console.log('⏳ AdminRoute: Waiting for profile to load before admin check');
    return (
      <div>
        <PageLoader 
          message="Loading profile data..." 
          className="min-h-screen"
        />
        {debugMode && (
          <div className="fixed bottom-4 right-4 bg-yellow-600 text-white p-4 rounded text-xs">
            <div>⏳ WAITING FOR PROFILE</div>
            <div>User: {user?.email}</div>
            <div>Profile loading...</div>
          </div>
        )}
      </div>
    );
  }
  
  // Redirect non-admin users to member dashboard (unless in debug mode)
  if (!hasAdminAccess && profile && !debugMode) {
    console.log('🚫 AdminRoute: User does not have admin access, redirecting to member dashboard');
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard/member" replace />;
  }
  
  // Render children for users with admin access
  console.log('✅ AdminRoute: Allowing access to admin content');
  return (
    <div>
      {children}
      {debugMode && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded text-xs max-w-sm">
          <div className="font-bold mb-2">✅ ADMIN ACCESS GRANTED</div>
          <div>🚧 Debug mode active</div>
          <div>User: {user?.email}</div>
          <div>Role: {profile?.role || 'N/A'}</div>
          <div>Is Super Admin: {profile?.is_super_admin ? 'Yes' : 'No'}</div>
          <div>Access would normally be: {profile?.is_super_admin === true || profile?.role === 'admin' ? 'Granted' : 'Denied'}</div>
        </div>
      )}
    </div>
  );
};

export default AdminRoute;
