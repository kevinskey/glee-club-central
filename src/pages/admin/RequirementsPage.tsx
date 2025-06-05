
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { RequirementsChecker } from '@/components/admin/RequirementsChecker';
import AdminDashboardAudit from '@/components/admin/AdminDashboardAudit';
import { CheckCircle } from 'lucide-react';

export default function RequirementsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Requirements Compliance"
        description="Verification that all system requirements are met"
        icon={<CheckCircle className="h-6 w-6" />}
      />
      
      <RequirementsChecker />
      
      <AdminDashboardAudit />
    </div>
  );
}
