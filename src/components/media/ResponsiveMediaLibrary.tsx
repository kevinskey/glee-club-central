
import React, { useState } from 'react';
import { OptimizedMediaLibrary } from '@/components/media/OptimizedMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ResponsiveMediaLibraryProps {
  isAdminView?: boolean;
  showUpload?: boolean;
  onUploadComplete?: () => void;
}

export function ResponsiveMediaLibrary({ 
  isAdminView = false, 
  showUpload = true,
  onUploadComplete 
}: ResponsiveMediaLibraryProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadComplete = () => {
    console.log("ResponsiveMediaLibrary: Upload complete");
    setIsUploadModalOpen(false);
    if (onUploadComplete) {
      onUploadComplete();
    }
    toast.success("Media uploaded successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Upload Button for Admin */}
      {isAdminView && showUpload && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="glass-button-primary shadow-lg hover:shadow-xl"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      )}

      {/* Main Media Library */}
      <OptimizedMediaLibrary isAdminView={isAdminView} />

      {/* Upload Modal */}
      {isAdminView && showUpload && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
}
