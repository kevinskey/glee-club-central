
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";

const MembersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Members Directory"
        description="Connect with your fellow Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Members directory is being updated. Please check back later.</p>
      </div>
    </div>
  );
};

export default MembersPage;
