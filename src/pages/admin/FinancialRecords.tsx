
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { DollarSign } from "lucide-react";

const FinancialRecords: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Financial Records"
        description="Manage Glee Club finances and dues"
        icon={<DollarSign className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Financial management tools are coming soon.</p>
      </div>
    </div>
  );
};

export default FinancialRecords;
