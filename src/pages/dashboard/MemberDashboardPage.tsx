
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

export default function MemberDashboardPage() {
  const { user, profile, isLoading, isInitialized } = useAuth();
  
  console.log('📊 MemberDashboardPage: DASHBOARD STATE:', {
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
    isInitialized
  });

  // Wait for full initialization and profile resolution
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message={!isInitialized ? "Initializing dashboard..." : "Loading your profile..."}
        className="min-h-screen"
      />
    );
  }

  // Ensure we have a user
  if (!user) {
    return (
      <PageLoader 
        message="Authentication required..."
        className="min-h-screen"
      />
    );
  }

  // Get display name with fallbacks
  const displayName = profile?.first_name || 
                     user?.user_metadata?.first_name || 
                     user?.email?.split('@')[0] || 
                     'Member';

  const memberRole = profile?.role || 'member';

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          {profile ? `Member Dashboard • Role: ${memberRole}` : 'Member Dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardModules />
          <DashboardEvents />
        </div>
        <div className="space-y-6">
          <DashboardAnnouncements />
        </div>
      </div>
    </div>
  );
}
