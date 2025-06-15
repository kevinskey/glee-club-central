
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { SimpleCSVUpload } from '@/components/members/SimpleCSVUpload';
import { Upload } from 'lucide-react';

export default function MemberCSVUploadPage() {
  return (
    <MobileOptimizedContainer className="pt-4 pb-12 px-3 sm:px-6">
      <PageHeader
        title="Import Members from CSV"
        description="Upload and process your member data from a CSV file with strict role validation"
        icon={<Upload className="h-6 w-6 sm:h-8 sm:w-8 text-glee-spelman" />}
      />
      
      <div className="mt-6">
        <SimpleCSVUpload />
      </div>
    </MobileOptimizedContainer>
  );
}
