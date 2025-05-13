import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon } from "lucide-react";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { MediaFilesSection } from "@/components/media/MediaFilesSection";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { usePermissions } from "@/hooks/usePermissions";
import { MediaStatsDisplay } from "@/components/media/MediaStatsDisplay";
import { MediaFilterBar } from "@/components/media/MediaFilterBar";
import { MediaLoadingState } from "@/components/media/MediaLoadingState";
import { MediaAccordionView } from "@/components/media/MediaAccordionView";
import { UploadMediaButton } from "@/components/media/UploadMediaButton";
import { MediaType } from "@/utils/mediaUtils";
import { PermissionName } from "@/types/permissions";

interface MediaLibraryPageProps {
  isAdminView?: boolean;
}

export default function MediaLibraryPage({ isAdminView = false }: MediaLibraryPageProps) {
  const { isSuperAdmin, hasPermission } = usePermissions();
  
  // Check if user has permission based on roles
  const canUploadMedia = isSuperAdmin || hasPermission('can_upload_media');
  const canEditMedia = isAdminView || isSuperAdmin || hasPermission('can_edit_media' as PermissionName);
  const canDeleteMedia = isAdminView || isSuperAdmin || hasPermission('can_delete_media' as PermissionName);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { 
    isLoading,
    error,
    mediaStats,
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    mediaTypes,
    categories,
    fetchAllMedia,
    deleteMediaItem
  } = useMediaLibrary();
  
  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!canDeleteMedia) return;
    
    try {
      await deleteMediaItem(mediaId);
      fetchAllMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FilesIcon className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to load media library</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <UploadMediaButton 
          onClick={() => fetchAllMedia()} 
          canUpload={true}
          label="Retry Loading"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {!isAdminView && (
        <PageHeader
          title="Media Library"
          description="Access and manage all your media files in one place"
          icon={<FilesIcon className="h-6 w-6" />}
        />
      )}
      
      {/* Stats Row */}
      <MediaStatsDisplay stats={mediaStats} />
      
      {/* Upload Button */}
      <UploadMediaButton 
        onClick={() => setIsUploadModalOpen(true)} 
        canUpload={canUploadMedia}
      />
      
      {/* Search and Filter Bar */}
      <MediaFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedMediaType={selectedMediaType as MediaType | "all"}
        setSelectedMediaType={setSelectedMediaType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dateFilter={dateFilter as "newest" | "oldest"}
        setDateFilter={setDateFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        mediaTypes={mediaTypes as MediaType[]}
        categories={categories}
      />
      
      {/* Loading State or Empty State */}
      <MediaLoadingState 
        isLoading={isLoading}
        isEmpty={filteredMediaFiles.length === 0}
        canUpload={canUploadMedia}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      
      {/* Media Files Display */}
      {!isLoading && filteredMediaFiles.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <MediaFilesSection 
              mediaFiles={filteredMediaFiles} 
              canEdit={canEditMedia}
              canDelete={canDeleteMedia}
              onDelete={handleDeleteMedia}
            />
          ) : (
            <MediaAccordionView 
              mediaFiles={filteredMediaFiles} 
              canEdit={canEditMedia}
              canDelete={canDeleteMedia}
              onDelete={handleDeleteMedia}
            />
          )}
        </>
      )}
      
      {/* Upload Modal */}
      <UploadMediaModal 
        onUploadComplete={handleUploadComplete}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
}
