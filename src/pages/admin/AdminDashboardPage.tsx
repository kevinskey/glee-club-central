
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { DatabaseConnectionTest } from "@/components/admin/DatabaseConnectionTest";

export default function AdminDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAdmin } = useAuth();

  console.log('🏛️ AdminDashboardPage: COMPLETE RENDER STATE:', {
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
    isAdminFunction: isAdmin(),
    timestamp: new Date().toISOString()
  });

  // Wait for initialization only
  if (!isInitialized) {
    console.log('⏳ AdminDashboardPage: Waiting for initialization...');
    return (
      <PageLoader 
        message="Initializing admin dashboard..."
        className="min-h-screen"
      />
    );
  }

  // Ensure we have a user
  if (!user) {
    console.log('🚫 AdminDashboardPage: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check admin access immediately - prioritize known admin email
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  
  console.log('🔍 AdminDashboardPage: ADMIN ACCESS CHECK:', {
    isKnownAdmin,
    hasProfileAccess: profile && isAdmin(),
    userEmail: user.email,
    profileRole: profile?.role,
    isLoadingProfile: isLoading
  });
  
  // If user is a known admin by email, show dashboard with diagnostic tools
  if (isKnownAdmin) {
    console.log('🏛️ AdminDashboardPage: Known admin by email, rendering dashboard with diagnostics');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Diagnostic Mode</h1>
          <div className="mb-8">
            <DatabaseConnectionTest />
          </div>
          <AdminDashboard />
        </div>
      </div>
    );
  }
  
  // For non-known admin emails, we need to wait for profile to load
  if (isLoading) {
    console.log('⏳ AdminDashboardPage: Loading profile for non-admin email...');
    return (
      <PageLoader 
        message="Verifying admin permissions..."
        className="min-h-screen"
      />
    );
  }

  // Final check for admin access via profile
  const hasAdminAccess = profile && isAdmin();
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminDashboardPage: User lacks admin access, redirecting to member dashboard');
    return <Navigate to="/dashboard/member" replace />;
  }

  console.log('🏛️ AdminDashboardPage: Profile-based admin access granted, rendering dashboard');
  return <AdminDashboard />;
}
