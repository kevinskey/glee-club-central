
import React from 'react';
import { DashboardModules } from '@/components/dashboard/DashboardModules';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminQuickActions } from '@/components/admin/AdminQuickActions';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { EditRoleTagsPanel } from '@/components/admin/EditRoleTagsPanel';
import { HeroTestButton } from '@/components/admin/HeroTestButton';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardContent() {
  const { user, profile } = useAuth();
  
  const isAdminRole = profile?.role === 'admin' || user?.email === 'kevinskey@mac.com';

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <AdminStatsCards />
      
      {/* Quick Actions */}
      <AdminQuickActions />
      
      {/* Hero System Test */}
      <HeroTestButton />
      
      {/* Edit Role Tags Panel - Only for Admin users */}
      {isAdminRole && (
        <EditRoleTagsPanel />
      )}
      
      {/* Dashboard Modules */}
      <div>
        <h2 className="text-xl font-bold mb-4">Dashboard Modules</h2>
        <DashboardModules />
      </div>
      
      {/* Recent Activity */}
      <AdminRecentActivity />
    </div>
  );
}
