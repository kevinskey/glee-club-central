
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

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

  // Check admin access immediately - don't wait for profile if user email is admin
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  const hasAdminAccess = isKnownAdmin || (profile && isAdmin());
  
  console.log('🔍 AdminDashboardPage: ADMIN ACCESS CHECK:', {
    isKnownAdmin,
    hasProfileAccess: profile && isAdmin(),
    hasAdminAccess,
    willRenderDashboard: hasAdminAccess || isKnownAdmin
  });
  
  // If we know the user is admin by email, don't wait for profile
  if (isKnownAdmin) {
    console.log('🏛️ AdminDashboardPage: Known admin by email, rendering dashboard');
    return <AdminDashboard />;
  }
  
  // If still loading profile and not a known admin, wait briefly
  if (isLoading && !profile) {
    console.log('⏳ AdminDashboardPage: Loading profile...');
    return (
      <PageLoader 
        message="Verifying admin permissions..."
        className="min-h-screen"
      />
    );
  }

  // Final admin check
  if (!hasAdminAccess) {
    console.log('🚫 AdminDashboardPage: User lacks admin access, redirecting to member dashboard');
    return <Navigate to="/dashboard/member" replace />;
  }

  console.log('🏛️ AdminDashboardPage: All checks passed, rendering AdminDashboard component');
  return <AdminDashboard />;
}
