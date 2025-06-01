
import React from "react";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAdmin } = useSimpleAuthContext();

  console.log('🏛️ AdminDashboardPage: ADMIN DASHBOARD STATE:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileId: profile?.id,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    profileStatus: profile?.status,
    isLoading,
    isInitialized,
    isAdminFunction: isAdmin()
  });

  // Wait for full initialization and profile resolution
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message={!isInitialized ? "Initializing admin dashboard..." : "Verifying admin permissions..."}
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

  // Wait for profile to be fully resolved before checking admin status
  if (!profile) {
    return (
      <PageLoader 
        message="Resolving admin permissions..."
        className="min-h-screen"
      />
    );
  }

  console.log('🏛️ AdminDashboardPage: Rendering AdminDashboard component');
  return <AdminDashboard />;
}
