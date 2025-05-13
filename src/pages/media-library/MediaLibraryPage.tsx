
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon, Search, FilterIcon, Grid, List } from "lucide-react";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { MediaType } from "@/utils/mediaUtils";
import { usePermissions } from "@/hooks/usePermissions";
import { MediaStatsDisplay } from "@/components/media/MediaStatsDisplay";
import { MediaFilterBar } from "@/components/media/MediaFilterBar";
import { MediaLoadingState } from "@/components/media/MediaLoadingState";
import { UploadMediaButton } from "@/components/media/UploadMediaButton";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { MediaListView } from "@/components/media/MediaListView";
import { MediaGridView } from "@/components/media/MediaGridView";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaTypeDropdown } from "@/components/media/MediaTypeDropdown";

interface MediaLibraryPageProps {
  isAdminView?: boolean;
}

export default function MediaLibraryPage({ isAdminView = false }: MediaLibraryPageProps) {
  const { isLoggedIn, hasPermission, isSuperAdmin, isAdminRole } = usePermissions();
  
  // Allow any authenticated user to upload media
  const canUploadMedia = isLoggedIn;
  // Admin permissions for editing and deleting
  const canEditMedia = isAdminView || isSuperAdmin || isAdminRole || hasPermission('can_edit_media');
  const canDeleteMedia = isAdminView || isSuperAdmin || isAdminRole || hasPermission('can_delete_media');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default to list view
  const isMobile = useIsMobile();

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
    <div className="space-y-4 md:space-y-6">
      {!isAdminView && (
        <PageHeader
          title="Media Library"
          description="Access and manage all your media files in one place"
          icon={<FilesIcon className="h-6 w-6" />}
        />
      )}
      
      {/* Stats Row - simplified on mobile */}
      {!isMobile && <MediaStatsDisplay stats={mediaStats} />}
      
      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <UploadMediaButton 
          onClick={() => setIsUploadModalOpen(true)} 
          canUpload={canUploadMedia}
        />
        
        {/* View toggle buttons */}
        <div className="flex gap-1">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")}
            className="px-2"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("grid")}
            className="px-2"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search and Filter Bar - simplified for mobile */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-input bg-background"
          />
        </div>
        
        {/* Media Type Dropdown for Mobile */}
        {isMobile && (
          <div className="w-full">
            <MediaTypeDropdown
              selected={selectedMediaType as MediaType | "all"}
              onSelect={setSelectedMediaType}
            />
          </div>
        )}
        
        {!isMobile && (
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
        )}
      </div>
      
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
            <MediaGridView 
              mediaFiles={filteredMediaFiles} 
              canEdit={canEditMedia}
              canDelete={canDeleteMedia}
              onDelete={handleDeleteMedia}
            />
          ) : (
            <MediaListView 
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
