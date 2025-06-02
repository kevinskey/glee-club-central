
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAdmin } = useAuth();

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
    console.log('🚫 AdminDashboardPage: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
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

  // Check admin access
  const hasAdminAccess = isAdmin();
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminDashboardPage: User lacks admin access, redirecting to member dashboard');
    return <Navigate to="/dashboard/member" replace />;
  }

  console.log('🏛️ AdminDashboardPage: Rendering AdminDashboard component');
  return <AdminDashboard />;
}
