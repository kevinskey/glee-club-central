
import React from "react";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function MemberDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated } = useSimpleAuthContext();
  const navigate = useNavigate();

  console.log('📊 MemberDashboard: State check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    isAuthenticated,
    isInitialized,
    userEmail: user?.email,
    profileRole: profile?.role
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
    return <Navigate to="/login" replace />;
  }

  // Show loading while profile loads
  if (!profile) {
    return (
      <PageLoader 
        message="Loading your profile..."
        className="min-h-screen"
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <DashboardHeader user={user} profile={profile} />
        <DashboardContent />
      </div>
    </ErrorBoundary>
  );
}
