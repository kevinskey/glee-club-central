
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Bell } from "lucide-react";

const AnnouncementsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Announcements"
        description="Stay updated with the latest Glee Club announcements"
        icon={<Bell className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">No new announcements at this time.</p>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
