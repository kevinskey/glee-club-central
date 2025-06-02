
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { FileImage, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MediaLibraryPageContent } from '@/components/media/MediaLibraryPageContent';
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
        description="Manage all media files including images, documents, and other uploads"
        icon={<FileImage className="h-6 w-6" />}
        actions={
          <Button 
            className="bg-glee-purple hover:bg-glee-purple/90"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Media
          </Button>
        }
      />
      
      <div className="mt-8">
        <MediaLibraryPageContent isAdminView={true} />
      </div>
      
      <UploadMediaModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default AdminMediaLibraryPage;
