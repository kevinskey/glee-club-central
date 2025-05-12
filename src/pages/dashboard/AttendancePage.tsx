
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { CheckSquare } from "lucide-react";

const AttendancePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Attendance"
        description="View your attendance record for rehearsals and performances"
        icon={<CheckSquare className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Attendance records will be displayed here.</p>
      </div>
    </div>
  );
};

export default AttendancePage;
