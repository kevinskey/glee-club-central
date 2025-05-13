
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { BellRing } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Important updates and notifications for Glee Club members"
        icon={<BellRing className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
        <p className="text-muted-foreground">Announcement content will be displayed here.</p>
      </div>
    </div>
  );
}
