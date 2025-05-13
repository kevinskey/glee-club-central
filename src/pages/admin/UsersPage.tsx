
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Users } from 'lucide-react';

const UsersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="User Management"
        description="Manage Glee Club members and their roles"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p>User management interface coming soon...</p>
      </div>
    </div>
  );
};

export default UsersPage;
