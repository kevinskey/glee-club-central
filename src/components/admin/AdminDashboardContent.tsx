
import React from 'react';
import { UnifiedAdminModules } from '@/components/admin/UnifiedAdminModules';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { EditRoleTagsPanel } from '@/components/admin/EditRoleTagsPanel';
import { TopSliderManager } from '@/components/admin/TopSliderManager';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardContent() {
  const { user, profile } = useAuth();
  
  const isAdminRole = profile?.role === 'admin' || user?.email === 'kevinskey@mac.com';

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <AdminStatsCards />
      
      {/* Unified Modules & Quick Actions */}
      <UnifiedAdminModules />

      {/* Two Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Top Slider Manager */}
          <TopSliderManager />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Edit Role Tags Panel - Only for Admin users */}
          {isAdminRole && (
            <EditRoleTagsPanel />
          )}
          
          {/* Recent Activity */}
          <AdminRecentActivity />
        </div>
      </div>
    </div>
  );
}
