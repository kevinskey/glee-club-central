
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Users } from 'lucide-react';
import UserManagementSimplified from '@/components/admin/UserManagementSimplified';

export default function UserManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="User Management"
        description="Manage Glee Club members, roles, and permissions"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <UserManagementSimplified />
      </div>
    </div>
  );
}
