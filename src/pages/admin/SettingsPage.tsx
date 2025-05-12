
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Settings"
        description="Configure Glee Club system settings"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">System settings configuration is under development.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
