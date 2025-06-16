
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { DollarSign } from "lucide-react";
import { FinancialDashboard } from '@/components/financial/FinancialDashboard';

const FinancialPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <PageHeader
        title="Financial Management"
        description="Comprehensive financial tracking and ledger management for the Spelman College Glee Club"
        icon={<DollarSign className="h-8 w-8" />}
      />
      
      <div className="mt-8">
        <FinancialDashboard />
      </div>
    </div>
  );
};

export default FinancialPage;
