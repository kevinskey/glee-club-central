
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { FanCSVUpload } from "@/components/admin/FanCSVUpload";

const FanBulkUploadPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader
        title="Bulk Fan Registration"
        description="Upload CSV files to register multiple fans at once"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <FanCSVUpload />
      </div>
    </div>
  );
};

export default FanBulkUploadPage;
