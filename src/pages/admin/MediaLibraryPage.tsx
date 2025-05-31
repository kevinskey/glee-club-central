
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FileImage } from 'lucide-react';
import MediaLibraryPage from '../media-library/MediaLibraryPage';
import { UploadMediaModal } from '@/components/UploadMediaModal';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleUploadComplete = () => {
    console.log("Admin: Upload complete");
    setIsUploadModalOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Library"
        icon={<FileImage className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <MediaLibraryPage isAdminView={true} />
      </div>
      
      {/* This is a backup in case the inner component's modal doesn't work */}
      <UploadMediaModal
        onUploadComplete={handleUploadComplete}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
};

export default AdminMediaLibraryPage;
