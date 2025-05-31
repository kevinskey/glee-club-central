
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings } from "lucide-react";
import { NotificationPreferences } from '@/components/settings/NotificationPreferences';
import { ProfileSummary } from '@/components/settings/ProfileSummary';
import { AccountControls } from '@/components/settings/AccountControls';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your preferences and account"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="mt-8 space-y-6">
        <ProfileSummary />
        <NotificationPreferences />
        <AccountControls />
      </div>
    </div>
  );
};

export default SettingsPage;
