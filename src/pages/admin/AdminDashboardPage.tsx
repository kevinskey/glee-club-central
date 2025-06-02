
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAdmin } = useAuth();

  console.log('🏛️ AdminDashboardPage: RENDER STATE:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasProfile: !!profile,
    isLoading,
    isInitialized,
    isAdminFunction: isAdmin(),
    timestamp: new Date().toISOString()
  });

  // Wait for initialization only if really needed
  if (!isInitialized) {
    console.log('⏳ AdminDashboardPage: Waiting for initialization...');
    return (
      <PageLoader 
        message="Initializing..."
        className="min-h-screen"
      />
    );
  }

  // Ensure we have a user
  if (!user) {
    console.log('🚫 AdminDashboardPage: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check admin access - prioritize known admin email immediately
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  
  if (isKnownAdmin) {
    console.log('🏛️ AdminDashboardPage: Known admin access granted');
    return <AdminDashboard />;
  }
  
  // For non-known admin emails, check profile but with shorter timeout
  if (isLoading && !profile) {
    console.log('⏳ AdminDashboardPage: Brief profile check...');
    return (
      <PageLoader 
        message="Verifying access..."
        className="min-h-screen"
      />
    );
  }

  // Final admin access check
  const hasAdminAccess = profile && isAdmin();
  
  if (!hasAdminAccess) {
    console.log('🚫 AdminDashboardPage: Access denied, redirecting to member dashboard');
    return <Navigate to="/dashboard/member" replace />;
  }

  console.log('🏛️ AdminDashboardPage: Profile-based admin access granted');
  return <AdminDashboard />;
}
