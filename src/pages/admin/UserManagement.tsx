
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { UserCog } from "lucide-react";

const UserManagement: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="User Management"
        description="Manage member accounts and permissions"
        icon={<UserCog className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">User management tools are being developed.</p>
      </div>
    </div>
  );
};

export default UserManagement;
