
import React from 'react';
import { DashboardModules } from '@/components/dashboard/DashboardModules';
import { DashboardEvents } from '@/components/dashboard/DashboardEvents';
import { DashboardAnnouncements } from '@/components/dashboard/DashboardAnnouncements';

export function DashboardContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <DashboardModules />
        <DashboardEvents events={[]} />
      </div>
      <div className="space-y-6">
        <DashboardAnnouncements />
      </div>
    </div>
  );
}
