
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "lucide-react";

const EventCalendar: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Event Calendar"
        description="Manage Glee Club events and schedule"
        icon={<Calendar className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Event calendar management is under construction.</p>
      </div>
    </div>
  );
};

export default EventCalendar;
