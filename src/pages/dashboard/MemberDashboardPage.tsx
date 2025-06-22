
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Header } from "@/components/landing/Header";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function MemberDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();

  console.log('📊 MemberDashboard: State check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    isAuthenticated,
    isInitialized,
    userEmail: user?.email,
    profileRole: profile?.role,
    profileId: profile?.id
  });

  // Show loading during auth initialization
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Initializing dashboard..."
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔒 MemberDashboard: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If we have a user but no profile, try to refresh
  if (!profile) {
    console.log('⚠️ MemberDashboard: User authenticated but no profile, attempting refresh...');
    
    // Trigger a profile refresh
    React.useEffect(() => {
      refreshProfile();
    }, [refreshProfile]);
    
    return (
      <PageLoader 
        message="Loading your profile..."
        className="min-h-screen"
      />
    );
  }

  console.log('✅ MemberDashboard: Ready to render dashboard');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          <DashboardHeader user={user} profile={profile} />
          <DashboardContent />
        </div>
      </div>
    </ErrorBoundary>
  );
}
