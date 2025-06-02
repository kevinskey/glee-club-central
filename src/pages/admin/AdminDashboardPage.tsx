
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { DatabaseConnectionTest } from "@/components/admin/DatabaseConnectionTest";

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

  // Wait for initialization
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

  // Check admin access - prioritize known admin email
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  
  console.log('🔍 AdminDashboardPage: ADMIN CHECK:', {
    isKnownAdmin,
    userEmail: user.email,
    hasProfileAccess: profile && isAdmin(),
    isLoadingProfile: isLoading
  });
  
  // If user is a known admin by email, render simple dashboard first
  if (isKnownAdmin) {
    console.log('🏛️ AdminDashboardPage: Rendering admin dashboard for known admin');
    
    try {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Dashboard is loading...
              </p>
            </div>
            
            {/* Database Connection Test */}
            <div className="mb-8">
              <DatabaseConnectionTest />
            </div>
            
            {/* Main Admin Dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <AdminDashboard />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('💥 AdminDashboardPage: Error rendering:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
            <p className="text-gray-600">Error loading admin dashboard.</p>
            <p className="text-sm text-gray-500 mt-2">Check console for details.</p>
          </div>
        </div>
      );
    }
  }
  
  // For non-known admin emails, check profile-based admin access
  if (isLoading) {
    console.log('⏳ AdminDashboardPage: Loading profile for admin verification...');
    return (
      <PageLoader 
        message="Verifying admin permissions..."
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
