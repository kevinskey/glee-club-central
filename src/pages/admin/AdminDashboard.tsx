
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Complete system management with live data integration"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <AdminDashboardContent />
      </div>
    </div>
  );
}
