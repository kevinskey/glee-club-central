
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminStatsCards } from "./AdminStatsCards";
import { AdminQuickActions } from "./AdminQuickActions";
import { AdminRecentActivity } from "./AdminRecentActivity";
import { AdminAnalyticsChart } from "./AdminAnalyticsChart";

interface AdminDashboardContentProps {
  isMobile?: boolean;
}

export function AdminDashboardContent({ isMobile = false }: AdminDashboardContentProps) {
  const { user, profile } = useAuth();
  
  console.log('AdminDashboardContent: Rendering with isMobile:', isMobile);
  
  // Get the user's first name with better fallback logic
  const firstName = profile?.first_name || 
                   user?.user_metadata?.first_name ||
                   user?.email?.split('@')[0] || 
                   'Admin';
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with the Glee Club today.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards isMobile={isMobile} />

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Analytics Chart - Takes up 2/3 on desktop */}
        <div className={isMobile ? 'order-2' : 'lg:col-span-2'}>
          <AdminAnalyticsChart isMobile={isMobile} />
        </div>

        {/* Quick Actions - Takes up 1/3 on desktop */}
        <div className={isMobile ? 'order-1' : ''}>
          <AdminQuickActions isMobile={isMobile} />
        </div>
      </div>

      {/* Recent Activity */}
      <AdminRecentActivity isMobile={isMobile} />
    </div>
  );
}
