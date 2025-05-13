
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
        <p className="text-muted-foreground">Settings content will be displayed here.</p>
      </div>
    </div>
  );
}
