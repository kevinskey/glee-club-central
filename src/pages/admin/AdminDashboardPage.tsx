
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const [debugMode] = React.useState(true); // Enable debug mode temporarily

  // Enhanced debug logging
  console.log('🏛️ AdminDashboardPage: DETAILED RENDER STATE:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileId: profile?.id,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    profileStatus: profile?.status,
    isLoading,
    timestamp: new Date().toISOString()
  });

  // Show loading while auth data is being fetched
  if (isLoading) {
    console.log('🏛️ AdminDashboardPage: Still loading auth data');
    return (
      <div>
        <PageLoader message="Loading admin dashboard..." />
        {debugMode && (
          <div className="fixed top-4 left-4 bg-purple-600 text-white p-4 rounded text-xs">
            <div>🏛️ ADMIN DASHBOARD DEBUG</div>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>User: {user?.email || 'None'}</div>
            <div>Profile: {profile?.role || 'None'}</div>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    console.log('🏛️ AdminDashboardPage: No user found');
    return (
      <div>
        <PageLoader message="Authenticating..." />
        {debugMode && (
          <div className="fixed top-4 left-4 bg-red-600 text-white p-4 rounded text-xs">
            <div>❌ NO USER - ADMIN DASHBOARD</div>
            <div>This shouldn't happen if auth is working</div>
          </div>
        )}
      </div>
    );
  }

  if (!profile && !debugMode) {
    console.log('🏛️ AdminDashboardPage: No profile found for user');
    return (
      <div>
        <PageLoader message="Loading profile..." />
        {debugMode && (
          <div className="fixed top-4 left-4 bg-yellow-600 text-white p-4 rounded text-xs">
            <div>⚠️ NO PROFILE - ADMIN DASHBOARD</div>
            <div>User: {user?.email}</div>
            <div>Normally would show loading...</div>
          </div>
        )}
      </div>
    );
  }

  console.log('🏛️ AdminDashboardPage: Rendering AdminDashboard component');
  return (
    <div>
      <AdminDashboard />
      {debugMode && (
        <div className="fixed top-4 left-4 bg-green-600 text-white p-4 rounded text-xs max-w-sm">
          <div className="font-bold mb-2">✅ ADMIN DASHBOARD LOADED</div>
          <div>User: {user?.email}</div>
          <div>Profile Role: {profile?.role || 'Missing'}</div>
          <div>Is Super Admin: {profile?.is_super_admin ? 'Yes' : 'No'}</div>
          <div>Profile Status: {profile?.status || 'Missing'}</div>
        </div>
      )}
    </div>
  );
}
