
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isLoading: authLoading, isAuthenticated, isAdmin, refreshUserData } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  
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
  
  const isLoading = (authLoading || permissionsLoading) && !loadingTimeout;
  
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
      isSuperAdmin,
      isAdminFunction: isAdmin ? isAdmin() : false,
      authLoading,
      permissionsLoading,
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
    
    const adminAccess = isSuperAdmin || profile?.is_super_admin === true || profile?.role === 'admin' || (isAdmin && isAdmin());
    
    console.log('🛡️ AdminRoute: Final admin access decision:', adminAccess);
    
    return adminAccess;
  }, [isSuperAdmin, profile, isAdmin, user, authLoading, permissionsLoading, loadingTimeout, debugMode]);
  
  const handleCreateProfile = async () => {
    if (!user) return;
    
    setIsCreatingProfile(true);
    try {
      console.log('🔧 AdminRoute: Creating admin profile for user:', user.id);
      
      const { supabaseClient } = useAuth();
      const { error } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || 'Admin',
          last_name: user.user_metadata?.last_name || 'User',
          role: 'admin',
          is_super_admin: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      console.log('🔧 AdminRoute: Profile creation result:', { error: error?.message });
      
      if (error) {
        console.error('❌ AdminRoute: Error creating profile:', error);
        toast.error('Failed to create profile. Please try again.');
      } else {
        toast.success('Profile created successfully!');
        // Refresh user data
        if (refreshUserData) {
          await refreshUserData();
        }
        setShowProfileWarning(false);
      }
    } catch (error) {
      console.error('💥 AdminRoute: Error creating profile:', error);
      toast.error('An unexpected error occurred while creating your profile.');
    } finally {
      setIsCreatingProfile(false);
    }
  };
  
  console.log('🛡️ AdminRoute: ROUTE DECISION CHECK:', {
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
            <div>Permissions Loading: {permissionsLoading ? 'Yes' : 'No'}</div>
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
  
  // Show profile creation UI if user exists but no profile
  if (showProfileWarning && !profile && !debugMode) {
    console.log('⚠️ AdminRoute: Showing profile creation UI');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-background border rounded-lg shadow-md text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Profile Missing</h2>
          <p className="text-muted-foreground mb-4">
            Your user account exists but no profile was found. Click below to create your admin profile.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={handleCreateProfile} 
              className="w-full"
              disabled={isCreatingProfile}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCreatingProfile ? 'animate-spin' : ''}`} />
              {isCreatingProfile ? 'Creating Profile...' : 'Create Admin Profile'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard/member'}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
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
          <div>Access would normally be: {isSuperAdmin || profile?.is_super_admin === true || profile?.role === 'admin' ? 'Granted' : 'Denied'}</div>
        </div>
      )}
    </div>
  );
};

export default AdminRoute;
