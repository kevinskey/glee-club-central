
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { FileImage, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { EnhancedMediaLibrary } from '@/components/media/EnhancedMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleUploadComplete = () => {
    console.log("Admin: Upload complete");
    setIsUploadModalOpen(false);
    // Trigger refresh of media library
    window.location.reload();
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
        <EnhancedMediaLibrary isAdminView={true} />
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
