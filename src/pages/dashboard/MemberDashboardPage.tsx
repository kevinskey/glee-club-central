
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

export default function MemberDashboardPage() {
  const { user, profile, isLoading } = useAuth();
  
  // Show loading only very briefly
  const [showContent, setShowContent] = React.useState(false);
  const [debugMode] = React.useState(true); // Enable debug mode temporarily
  
  React.useEffect(() => {
    // Show content after a short delay, even if profile is still loading
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('📊 MemberDashboardPage: DETAILED RENDER STATE:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileId: profile?.id,
    profileRole: profile?.role,
    profileStatus: profile?.status,
    profileFirstName: profile?.first_name,
    profileLastName: profile?.last_name,
    isLoading,
    showContent,
    timestamp: new Date().toISOString()
  });

  // Show loading state briefly
  if (isLoading && !showContent) {
    return (
      <div>
        <PageLoader message="Loading your dashboard..." />
        {debugMode && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded text-xs">
            <div>📊 MEMBER DASHBOARD DEBUG</div>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Show Content: {showContent ? 'Yes' : 'No'}</div>
            <div>User: {user?.email || 'None'}</div>
          </div>
        )}
      </div>
    );
  }

  // If no user, something is wrong with auth
  if (!user) {
    return (
      <div>
        <PageLoader message="Authentication required..." />
        {debugMode && (
          <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded text-xs">
            <div>❌ NO USER FOUND</div>
            <div>This shouldn't happen if auth is working</div>
          </div>
        )}
      </div>
    );
  }

  // Get display name with fallbacks
  const displayName = profile?.first_name || 
                     user?.user_metadata?.first_name || 
                     user?.email?.split('@')[0] || 
                     'Member';

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with the Spelman Glee Club
          {!profile && " (Profile loading...)"}
        </p>
      </div>
      
      <div className="grid gap-6">
        <DashboardModules />
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardEvents events={[]} />
          <DashboardAnnouncements />
        </div>
      </div>

      {debugMode && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded text-xs max-w-sm">
          <div className="font-bold mb-2">✅ MEMBER DASHBOARD LOADED</div>
          <div>User ID: {user?.id}</div>
          <div>Email: {user?.email}</div>
          <div>Profile ID: {profile?.id || 'Missing'}</div>
          <div>Display Name: {displayName}</div>
          <div>Role: {profile?.role || 'Missing'}</div>
          <div>Profile Status: {profile?.status || 'Missing'}</div>
        </div>
      )}
    </div>
  );
}
