
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { LibraryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { ResponsiveMediaLibrary } from "@/components/media/ResponsiveMediaLibrary";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";

const MediaLibraryIntegratedPage = () => {
  const { user, profile } = useAuth();
  const { hasPermission: legacyHasPermission } = usePermissions();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  console.log("MediaLibraryIntegratedPage - User:", user);
  console.log("MediaLibraryIntegratedPage - Profile:", profile);
  
  // Check permissions - temporarily simplify for debugging
  const canUpload = !!user;
  const canEdit = legacyHasPermission('can_edit_media');
  const canDelete = legacyHasPermission('can_delete_media');
  
  console.log("MediaLibraryIntegratedPage - Can upload:", canUpload);
  
  const { fetchAllMedia } = useMediaLibrary();

  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
    setIsUploadModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    console.log("Opening upload modal");
    setIsUploadModalOpen(true);
  };

  return (
    <div className="px-1 sm:px-2 md:px-3 lg:px-4 py-6 space-y-8">
      <div className="glass-card p-4 sm:p-6 rounded-2xl animate-glass-fade-in">
        <PageHeader
          title="Media Library"
          description="Manage and use media across the site"
          icon={<LibraryIcon className="h-6 w-6 text-[#0072CE]" />}
        />
      </div>
      
      <div className="space-y-6">
        {/* Upload button for mobile/tablet friendly access */}
        {canUpload && (
          <div className="glass-card p-4 rounded-2xl">
            <Button 
              onClick={handleOpenUploadModal}
              className="glass-button-primary rounded-xl min-h-[44px] w-full sm:w-auto"
            >
              Upload New Media
            </Button>
          </div>
        )}

        {/* Responsive Media Library */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <ResponsiveMediaLibrary
            isAdminView={canEdit || canDelete}
            showUpload={false} // We handle upload separately above
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </div>
      
      {/* Upload Modal */}
      {canUpload && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default MediaLibraryIntegratedPage;
