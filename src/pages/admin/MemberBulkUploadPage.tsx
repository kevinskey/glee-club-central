
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { MemberCSVUpload } from "@/components/members/MemberCSVUpload";

const MemberBulkUploadPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader
        title="Bulk Member Registration"
        description="Upload CSV files to register multiple members at once"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <MemberCSVUpload />
      </div>
    </div>
  );
};

export default MemberBulkUploadPage;
