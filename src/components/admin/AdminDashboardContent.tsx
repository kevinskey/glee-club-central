
import React from 'react';
import { UnifiedAdminModules } from '@/components/admin/UnifiedAdminModules';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { EditRoleTagsPanel } from '@/components/admin/EditRoleTagsPanel';
import { AdminPriorityActions } from '@/components/admin/AdminPriorityActions';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardContent() {
  const { user, profile } = useAuth();
  
  const isAdminRole = profile?.role === 'admin' || user?.email === 'kevinskey@mac.com';

  return (
    <div className="space-y-6">
      {/* Compact Stats Overview */}
      <AdminStatsCards isMobile={true} />
      
      {/* Priority Actions - Top 4 buttons you use most */}
      <AdminPriorityActions />

      {/* Secondary Modules - Everything else */}
      <UnifiedAdminModules />

      {/* Two Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Edit Role Tags Panel - Only for Admin users */}
          {isAdminRole && (
            <EditRoleTagsPanel />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <AdminRecentActivity />
        </div>
      </div>
    </div>
  );
}
