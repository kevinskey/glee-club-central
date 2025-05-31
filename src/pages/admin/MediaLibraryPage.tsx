
import React, { useState } from 'react';
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
      <div className="mb-6">
        <div className="flex justify-between items-center min-h-[3rem]">
          <div className="flex items-center gap-2">
            <div className="text-primary flex items-center"><FileImage className="h-6 w-6" /></div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">Media Library</h1>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <MediaLibraryPage isAdminView={true} />
      </div>
      
      <UploadMediaModal
        onUploadComplete={handleUploadComplete}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
};

export default AdminMediaLibraryPage;
