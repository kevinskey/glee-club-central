
import React from 'react';
import { PermissionRoute } from '@/components/auth/PermissionRoute';
import { PermissionManagement } from '@/components/admin/PermissionManagement';
import { PageHeader } from '@/components/ui/page-header';
import { Shield } from 'lucide-react';

export default function PermissionsPage() {
  return (
    <PermissionRoute requiredPage="/admin/permissions">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Permission Management"
          description="Manage user and role-based permissions for features and pages"
          icon={<Shield className="h-6 w-6" />}
        />
        
        <div className="mt-8">
          <PermissionManagement />
        </div>
      </div>
    </PermissionRoute>
  );
}
