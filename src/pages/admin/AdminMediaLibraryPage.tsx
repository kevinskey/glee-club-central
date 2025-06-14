
import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from "@/components/ui/page-header";
import { FileImage, Upload, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { EnhancedMediaLibrary } from '@/components/media/EnhancedMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { toast } from 'sonner';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { fetchAllMedia, isLoading } = useMediaLibrary();
  
  const handleUploadComplete = () => {
    console.log("Admin: Upload complete");
    setIsUploadModalOpen(false);
    fetchAllMedia();
    toast.success("Media uploaded successfully!");
  };

  const handleRefresh = () => {
    fetchAllMedia();
    toast.success("Media library refreshed");
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Media Library"
          description="Manage all media files including images, documents, and other uploads for the Glee Club"
          icon={<FileImage className="h-6 w-6" />}
          actions={
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                className="bg-glee-purple hover:bg-glee-purple/90"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Media
              </Button>
            </div>
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
    </AdminLayout>
  );
};

export default AdminMediaLibraryPage;
