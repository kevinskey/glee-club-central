
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading } = useAuth();

  // Enhanced debug logging
  console.log('AdminDashboardPage render state:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    userRole: profile?.role,
    isAdmin: profile?.is_super_admin,
    isLoading,
    timestamp: new Date().toISOString()
  });

  // Show loading while auth data is being fetched
  if (isLoading) {
    console.log('AdminDashboardPage: Still loading auth data');
    return <PageLoader message="Loading admin dashboard..." />;
  }

  if (!user) {
    console.log('AdminDashboardPage: No user found');
    return <PageLoader message="Authenticating..." />;
  }

  if (!profile) {
    console.log('AdminDashboardPage: No profile found for user');
    return <PageLoader message="Loading profile..." />;
  }

  console.log('AdminDashboardPage: Rendering AdminDashboard component');
  return <AdminDashboard />;
}
