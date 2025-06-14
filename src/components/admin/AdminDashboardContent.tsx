
import React from 'react';
import { UnifiedAdminModules } from '@/components/admin/UnifiedAdminModules';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { EditRoleTagsPanel } from '@/components/admin/EditRoleTagsPanel';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardContent() {
  const { user, profile } = useAuth();
  
  const isAdminRole = profile?.role === 'admin' || user?.email === 'kevinskey@mac.com';

  return (
    <div className="w-full max-w-full space-y-8">
      {/* Admin Modules - Full Width */}
      <div className="w-full">
        <UnifiedAdminModules />
      </div>

      {/* Two Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
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
