
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FileImage } from 'lucide-react';

const MediaLibraryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Library"
        description="Manage all media files for the Glee Club"
        icon={<FileImage className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p>Media library management coming soon...</p>
      </div>
    </div>
  );
};

export default MediaLibraryPage;
