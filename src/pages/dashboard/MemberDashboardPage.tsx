
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

export default function MemberDashboardPage() {
  const { user, profile, isLoading } = useAuth();
  
  // Much shorter loading timeout for dashboard
  const [showDashboard, setShowDashboard] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowDashboard(true);
    }, 1000); // Show dashboard after 1 second even if profile is loading
    
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  console.log('MemberDashboardPage state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isLoading,
    showDashboard
  });

  // Show loading only very briefly
  if (isLoading && !showDashboard) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  // If no user after loading timeout, something is wrong
  if (!user && showDashboard) {
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
    </div>
  );
}
