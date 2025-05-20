
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Bell } from "lucide-react";

const AnnouncementsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Announcements"
        description="Check here for the latest announcements and updates"
        icon={<Bell className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">No recent announcements to display.</p>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
