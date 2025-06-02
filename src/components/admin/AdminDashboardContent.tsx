
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminStatsCards } from "./AdminStatsCards";
import { AdminQuickActions } from "./AdminQuickActions";
import { AdminRecentActivity } from "./AdminRecentActivity";
import { AdminAnalyticsChart } from "./AdminAnalyticsChart";
import { AdminMediaOverview } from "./AdminMediaOverview";
import { MobileAdminDashboard } from "./MobileAdminDashboard";

export function AdminDashboardContent() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileAdminDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <AdminStatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1">
          <AdminQuickActions />
        </div>
        
        {/* Middle Column - Media Overview */}
        <div className="lg:col-span-1">
          <AdminMediaOverview />
        </div>
        
        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <AdminRecentActivity />
        </div>
      </div>
      
      {/* Analytics Chart */}
      <div className="mt-6">
        <AdminAnalyticsChart />
      </div>
    </div>
  );
}
