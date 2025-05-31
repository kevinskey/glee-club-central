
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

  // Show loading while auth data is being fetched
  if (isLoading || !user || !profile) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {profile.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with the Spelman Glee Club
        </p>
      </div>
      
      <div className="grid gap-6">
        <DashboardModules />
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardEvents />
          <DashboardAnnouncements />
        </div>
      </div>
    </div>
  );
}
