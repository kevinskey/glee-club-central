
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FileImage } from 'lucide-react';
import MediaLibraryPage from '../media-library/MediaLibraryPage';

const AdminMediaLibraryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Library"
        description="Manage all media files for the Glee Club"
        icon={<FileImage className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <MediaLibraryPage isAdminView={true} />
      </div>
    </div>
  );
};

export default AdminMediaLibraryPage;
