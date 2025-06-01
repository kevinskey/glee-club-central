
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
  
  React.useEffect(() => {
    // Show content after a short delay, even if profile is still loading
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('MemberDashboardPage render:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isLoading,
    showContent
  });

  // Show loading state briefly
  if (isLoading && !showContent) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  // If no user, something is wrong with auth
  if (!user) {
    return <PageLoader message="Authentication required..." />;
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
    </div>
  );
}
