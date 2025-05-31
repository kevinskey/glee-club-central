
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

export default function MemberDashboardPage() {
  const { user, profile, isLoading } = useAuth();

  // Debug logging
  console.log('MemberDashboardPage state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isLoading
  });

  // Show loading only while auth is actively loading, not when profile is missing
  if (isLoading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  // If no user after loading is complete, something is wrong
  if (!user) {
    return <PageLoader message="Authentication required..." />;
  }

  // Get display name with fallback
  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with the Spelman Glee Club
        </p>
      </div>
      
      <div className="grid gap-6">
        <DashboardModules />
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardEvents events={[]} />
          <DashboardAnnouncements />
        </div>
      </div>
    </div>
  );
}
