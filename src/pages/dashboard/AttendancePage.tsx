
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar } from 'lucide-react';

const AttendancePage = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Attendance Records"
        description="Track and view attendance for rehearsals and performances"
        icon={<Calendar className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Attendance Dashboard</h2>
          <p className="text-muted-foreground">
            This feature is currently under development. Please check back soon for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
