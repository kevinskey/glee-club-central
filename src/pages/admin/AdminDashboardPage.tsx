
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { AdminDashboard } from "./AdminDashboard";

export default function AdminDashboardPage() {
  const { user, profile, isLoading } = useAuth();

  // Debug logging
  console.log('AdminDashboardPage state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isAdmin: profile?.is_super_admin,
    isLoading
  });

  // Show loading while auth data is being fetched
  if (isLoading || !user || !profile) {
    return <PageLoader message="Loading admin dashboard..." />;
  }

  return <AdminDashboard />;
}
