
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Music } from 'lucide-react';

const SectionManagerPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Section Manager"
        description="Manage voice sections and member assignments"
        icon={<Music className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p>Section management interface coming soon...</p>
      </div>
    </div>
  );
};

export default SectionManagerPage;
