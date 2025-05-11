
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

export default function MediaLibraryPage() {
  const { isSuperAdmin, hasPermission } = usePermissions();
  
  // Check if user has permission to upload files
  const canUploadMedia = isSuperAdmin || hasPermission('can_upload_media');
  
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
    fetchAllMedia
  } = useMediaLibrary();
  
  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
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
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Media Library"
        description="Access and manage all your media files in one place"
        icon={<FilesIcon className="h-6 w-6" />}
      />
      
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
        selectedMediaType={selectedMediaType}
        setSelectedMediaType={setSelectedMediaType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        mediaTypes={mediaTypes}
      />
      
      {/* Content Area - Loading, Empty or Files */}
      <MediaLoadingState 
        isLoading={isLoading}
        isEmpty={filteredMediaFiles.length === 0}
        canUpload={canUploadMedia}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      
      {!isLoading && filteredMediaFiles.length > 0 && (
        <>
          {selectedMediaType === "all" && selectedCategory === "all" ? (
            // When showing all types, use accordion for better organization
            <MediaAccordionView 
              files={filteredMediaFiles}
              mediaTypes={mediaTypes}
              viewMode={viewMode}
              onDelete={fetchAllMedia}
            />
          ) : (
            // When filtered, show all matching files
            <MediaFilesSection
              files={filteredMediaFiles}
              mediaType={selectedMediaType}
              viewMode={viewMode}
              onDelete={fetchAllMedia}
              title={selectedCategory !== "all" ? `${selectedCategory.replace('_', ' ')}` : undefined}
            />
          )}
        </>
      )}

      <UploadMediaModal 
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
        defaultCategory={selectedCategory !== "all" ? selectedCategory : "general"}
      />
    </div>
  );
}
