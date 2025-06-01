
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useNavigate, Navigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { ProfileErrorDisplay } from "@/components/dashboard/ProfileErrorDisplay";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function MemberDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isAuthenticated, isInitialized } = useProfile();
  const navigate = useNavigate();

  console.log('📊 MemberDashboard: State check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    authLoading,
    isAuthenticated,
    isInitialized
  });

  // Show loading during auth initialization
  if (authLoading || !isInitialized) {
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

  // Show error if profile is missing (shouldn't happen with ProfileContext)
  if (!profile) {
    return (
      <ProfileErrorDisplay
        user={user}
        profileError="Profile not found"
        onRetry={() => window.location.reload()}
        onBackToLogin={() => navigate('/login', { replace: true })}
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
